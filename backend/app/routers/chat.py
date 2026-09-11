from fastapi import APIRouter, Request

from app.core.client_ip import get_client_ip
from app.models.chat import ChatRequest, ChatResponse
from app.services.chat_service import process_chat

router = APIRouter(tags=["chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat(request_body: ChatRequest, request: Request) -> ChatResponse:
    client_ip = get_client_ip(request)
    return await process_chat(request_body, client_ip)
