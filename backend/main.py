from fastapi import FastAPI, HTTPException
import httpx
import os
from datetime import datetime, timedelta, date
from collections import defaultdict

app = FastAPI()

GITHUB_API_BASE = "https://api.github.com"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

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

@app.get("/user/{username}/repos/recent")
async def get_recent_repos(username: str):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{GITHUB_API_BASE}/users/{username}/repos?per_page=100&sort=pushed", headers=headers)
        resp.raise_for_status()
        repos = resp.json()
        sorted_repos = sorted(repos, key=lambda r: r["pushed_at"], reverse=True)
        top_3 = sorted_repos[:3]
        return [{"name": r["name"], "html_url": r["html_url"]} for r in top_3]


