from pwdlib import PasswordHash

password_hasher = PasswordHash.recommended()

def get_password_hash(password: str) -> str:
    return password_hasher.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return password_hasher.verify(password, hashed)