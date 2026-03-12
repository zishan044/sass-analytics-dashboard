import os
import time
import csv
from ..core.celery import celery_app

@celery_app.task(bind=True, name="generate_project_report")
def generate_project_report(self, project_id: int):
    self.update_state(state='PROGRESS', meta={'current': 25, 'total': 100})
    time.sleep(2)
    
    self.update_state(state='PROGRESS', meta={'current': 75, 'total': 100})
    time.sleep(3)
    
    report_dir = "reports"
    if not os.path.exists(report_dir):
        os.makedirs(report_dir)
        
    file_path = f"{report_dir}/report_project_{project_id}.csv"
    
    with open(file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Project ID", "Status", "Generated At"])
        writer.writerow([project_id, "Completed", time.ctime()])
        
    return {"status": "SUCCESS", "file_path": file_path}