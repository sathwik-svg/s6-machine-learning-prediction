export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({
        status: "healthy",
        service: "S6 Machine Learning Prediction API",
        model: "Employee Attrition Prediction"
      });
    }

    if (url.pathname === "/predict" && request.method === "POST") {
      try {
        const data = await request.json();

        const age = Number(data.age);
        const income = Number(data.monthly_income);
        const years = Number(data.years_at_company);
        const satisfaction = Number(data.job_satisfaction);
        const overtime = data.overtime === "Yes" ? 1 : 0;
        const balance = Number(data.work_life_balance);

        if (
          age < 18 ||
          income <= 0 ||
          years < 0 ||
          satisfaction < 1 ||
          satisfaction > 5 ||
          balance < 1 ||
          balance > 5
        ) {
          return Response.json(
            { error: "Invalid prediction input" },
            { status: 400 }
          );
        }

        const score =
          -2.2 +
          (overtime * 1.4) +
          ((30 - Math.min(age, 30)) * 0.025) +
          ((3 - satisfaction) * 0.65) +
          ((3 - balance) * 0.55) -
          (years * 0.08) -
          (income / 10000 * 0.25);

        const probability = 1 / (1 + Math.exp(-score));

        const riskPercentage = Number((probability * 100).toFixed(2));

        return Response.json({
          prediction:
            probability >= 0.5
              ? "High Attrition Risk"
              : "Low Attrition Risk",
          attrition: probability >= 0.5,
          probability: Number(probability.toFixed(4)),
          risk_percentage: riskPercentage,
          model: "Cloudflare Worker ML Inference"
        });
      } catch {
        return Response.json(
          { error: "Invalid JSON request" },
          { status: 400 }
        );
      }
    }

    return new Response("S6 Machine Learning Prediction API", {
      status: 200
    });
  }
};
