package com.quantview.controller;

import com.quantview.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class PredictionController {

    private final RestTemplate restTemplate;
    private final String pythonServiceUrl;

    public PredictionController(
            @Value("${python.service.url:http://localhost:5000}") String pythonServiceUrl) {
        this.restTemplate = new RestTemplate();
        this.pythonServiceUrl = pythonServiceUrl;
    }

    /**
     * GET /api/predict/{ticker}
     * Caches for 300s. Forwards the request to Python Flask.
     */
    @Cacheable(value = "predictions", key = "#ticker.toUpperCase()")
    @GetMapping("/api/predict/{ticker}")
    public ResponseEntity<ApiResponse<Object>> getPrediction(@PathVariable String ticker) {
        System.out.println("[PredictionController] Forwarding /predict for " + ticker);
        String url = pythonServiceUrl + "/predict?ticker=" + ticker.toUpperCase();
        
        // Fetch raw JSON from python model, it is mapped into Object by RestTemplate (Jackson)
        Object pythonResponse = restTemplate.getForObject(url, Object.class);
        return ResponseEntity.ok(ApiResponse.success(pythonResponse));
    }
}
