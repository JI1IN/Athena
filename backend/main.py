from fastapi import FastAPI, HTTPException
import httpx
import os

app = FastAPI()

GITHUB_API_BASE = "https://api.github.com"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")  # Read token from environment variable

headers = {}
if GITHUB_TOKEN:
    headers["Authorization"] = f"token {GITHUB_TOKEN}"

@app.get("/user/{username}")
async def get_user(username: str):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{GITHUB_API_BASE}/users/{username}", headers=headers)
        if resp.status_code == 404:
            raise HTTPException(status_code=404, detail="User not found")
        resp.raise_for_status()
        return resp.json()

@app.get("/user/{username}/repos")
async def get_repos(username: str):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{GITHUB_API_BASE}/users/{username}/repos?per_page=100", headers=headers)
        resp.raise_for_status()
        return resp.json()
