import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from ..core.config import settings
from ..core import get_current_user, get_session
from ..models import User

stripe.api_key = settings.STRIPE_SECRET_KEY
billing_router = APIRouter(prefix="/billing", tags=["billing"])

@billing_router.post("/checkout-session")
async def create_checkout_session(current_user: User = Depends(get_current_user)):
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price": settings.STRIPE_PRICE_ID, 
                "quantity": 1,
            }],
            mode="subscription",
            success_url=f"{settings.FRONTEND_URL}/dashboard?success=true",
            cancel_url=f"{settings.FRONTEND_URL}/billing?canceled=true",

            metadata={"user_id": str(current_user.id)} 
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@billing_router.post("/webhook")
async def stripe_webhook(request: Request, session: AsyncSession = Depends(get_session)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid Webhook Signature")

    if event["type"] == "checkout.session.completed":
        checkout_session = event["data"]["object"]
        user_id = checkout_session["metadata"].get("user_id")
        stripe_cust_id = checkout_session.get("customer")

        if user_id:
            statement = select(User).where(User.id == int(user_id))
            result = await session.execute(statement)
            db_user = result.scalar_one_or_none()

            if db_user:
                db_user.subscription_status = "active"
                db_user.stripe_customer_id = stripe_cust_id
                await session.commit()
                print(f"✅ User {user_id} upgraded to active.")

    return {"status": "success"}