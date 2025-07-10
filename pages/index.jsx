import React, { useState } from "react";

export default function Home() {
  const [data, setData] = useState({
    premium: 100,
    lossRatio: 60,
    treatyShare: 50,
    facOutPremium: 10,
    facCommissionRate: 15,
    frontendCommissionRate: 15,
    operatingCost: 5,
  });

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const treatyOutPremium = (data.premium * data.treatyShare) / 100;
  const treatyClaim = (treatyOutPremium * data.lossRatio) / 100;
  const treatyLossRatio = treatyOutPremium ? (treatyClaim / treatyOutPremium) * 100 : 0;

  const getSlidingCommissionRate = (lr) => {
    if (lr <= 43) return 38.3;
    if (lr > 81) return 9.3;
    return 38.3 - (lr - 43) * 0.75;
  };

  const treatyCommissionRate = getSlidingCommissionRate(treatyLossRatio);
  const treatyCommission = (treatyOutPremium * treatyCommissionRate) / 100;

  const facClaim = (data.facOutPremium * data.lossRatio) / 100;
  const facCommission = (data.facOutPremium * data.facCommissionRate) / 100;

  const retainedPremium = data.premium - treatyOutPremium - data.facOutPremium;
  const totalClaim = (data.premium * data.lossRatio) / 100;
  const retainedClaim = totalClaim - treatyClaim - facClaim;
  const frontendCost = (data.premium * data.frontendCommissionRate) / 100;

  const underwritingProfit =
    retainedPremium - retainedClaim - frontendCost - data.operatingCost + treatyCommission + facCommission;
  const profitRatio = (underwritingProfit / data.premium) * 100;

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 600, margin: "auto" }}>
      <h2>承保利润测算工具</h2>
      {[
        ["总保费收入（万元）", "premium"],
        ["预计赔付率（%）", "lossRatio"],
        ["合约分出比例（%）", "treatyShare"],
        ["临分分出保费（万元）", "facOutPremium"],
        ["临分手续费率（%）", "facCommissionRate"],
        ["前端手续费率（%）", "frontendCommissionRate"],
        ["其他运营费用（万元）", "operatingCost"],
      ].map(([label, field]) => (
        <div key={field} style={{ margin: "8px 0" }}>
          <label>{label}</label>
          <input
            type="number"
            value={data[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          />
        </div>
      ))}

      <hr style={{ margin: "20px 0" }} />
      <p>合约浮动手续费率：{treatyCommissionRate.toFixed(2)}%</p>
      <p>承保利润：{underwritingProfit.toFixed(2)} 万元</p>
      <p>承保利润率：{profitRatio.toFixed(2)}%</p>
    </div>
  );
}