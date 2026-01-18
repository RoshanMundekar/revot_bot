"""
Performance monitoring and metrics for LLM providers
Tracks latency, token usage, and error rates
"""

import time
from typing import Dict, Optional
from dataclasses import dataclass, field
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


@dataclass
class RequestMetrics:
    """Metrics for a single API request"""
    provider: str
    model: str
    latency_ms: float
    tokens_used: Optional[int] = None
    success: bool = True
    error: Optional[str] = None
    timestamp: datetime = field(default_factory=datetime.now)


class PerformanceMonitor:
    """Monitor and track LLM provider performance"""
    
    def __init__(self):
        self.requests: list[RequestMetrics] = []
        self.max_history = 1000  # Keep last 1000 requests
    
    def record_request(self, metrics: RequestMetrics):
        """Record a request"""
        self.requests.append(metrics)
        
        # Trim history if needed
        if len(self.requests) > self.max_history:
            self.requests = self.requests[-self.max_history:]
        
        # Log slow requests
        if metrics.latency_ms > 5000:  # 5 seconds
            logger.warning(
                f"Slow API call: {metrics.provider} took {metrics.latency_ms:.0f}ms"
            )
    
    def get_stats(self, provider: Optional[str] = None) -> Dict:
        """
        Get performance statistics.
        
        Args:
            provider: Optional provider name to filter by
            
        Returns:
            Dictionary with performance stats
        """
        requests = self.requests
        if provider:
            requests = [r for r in requests if r.provider == provider]
        
        if not requests:
            return {"message": "No requests recorded"}
        
        latencies = [r.latency_ms for r in requests]
        successes = sum(1 for r in requests if r.success)
        failures = len(requests) - successes
        
        return {
            "total_requests": len(requests),
            "success_rate": f"{(successes / len(requests) * 100):.1f}%",
            "average_latency_ms": sum(latencies) / len(latencies),
            "min_latency_ms": min(latencies),
            "max_latency_ms": max(latencies),
            "total_failures": failures
        }
    
    def clear(self):
        """Clear all metrics"""
        self.requests = []


# Global performance monitor instance
monitor = PerformanceMonitor()


class TimingContext:
    """Context manager for timing API calls"""
    
    def __init__(self, provider: str, model: str):
        self.provider = provider
        self.model = model
        self.start_time = None
        self.end_time = None
    
    def __enter__(self):
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end_time = time.time()
        latency_ms = (self.end_time - self.start_time) * 1000
        
        metrics = RequestMetrics(
            provider=self.provider,
            model=self.model,
            latency_ms=latency_ms,
            success=exc_type is None,
            error=str(exc_val) if exc_val else None
        )
        
        monitor.record_request(metrics)
        
        return False  # Don't suppress exceptions
