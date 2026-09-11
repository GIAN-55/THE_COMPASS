import pytest

from app.core.rate_limiter import check_and_increment, reset_memory_store

@pytest.fixture(autouse=True)
def clear_memory():
    reset_memory_store()
    yield
    reset_memory_store()

@pytest.mark.asyncio
async def test_allows_three_messages():
    for _ in range(3):
        allowed, count = await check_and_increment("192.168.1.1")
        assert allowed is True
        assert count <= 3

@pytest.mark.asyncio
async def test_blocks_fourth_message():
    for _ in range(3):
        await check_and_increment("10.0.0.5")
    allowed, count = await check_and_increment("10.0.0.5")
    assert allowed is False
    assert count == 4

@pytest.mark.asyncio
async def test_different_ips_have_separate_limits():
    for _ in range(3):
        await check_and_increment("1.1.1.1")
    allowed, _ = await check_and_increment("2.2.2.2")
    assert allowed is True
