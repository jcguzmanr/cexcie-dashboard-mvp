from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
import uvicorn

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to CExCIE Dashboard API",
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_STR}/docs"
    }

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Import routers
from routers import prospects_legacy, dashboard_legacy, analytics, reports
app.include_router(prospects_legacy.router, prefix=f"{settings.API_V1_STR}", tags=["prospects"])
app.include_router(dashboard_legacy.router, prefix=f"{settings.API_V1_STR}", tags=["dashboard"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}", tags=["analytics"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}", tags=["reports"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 