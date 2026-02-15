export interface MathSymbol {
    label: string;
    value: string;
    description?: string;
}

export const mathSymbols: MathSymbol[] = [
    // Greek Letters
    { label: "\\alpha", value: "\\alpha", description: "α" },
    { label: "\\beta", value: "\\beta", description: "β" },
    { label: "\\gamma", value: "\\gamma", description: "γ" },
    { label: "\\delta", value: "\\delta", description: "δ" },
    { label: "\\epsilon", value: "\\epsilon", description: "ϵ" },
    { label: "\\zeta", value: "\\zeta", description: "ζ" },
    { label: "\\eta", value: "\\eta", description: "η" },
    { label: "\\theta", value: "\\theta", description: "θ" },
    { label: "\\iota", value: "\\iota", description: "ι" },
    { label: "\\kappa", value: "\\kappa", description: "κ" },
    { label: "\\lambda", value: "\\lambda", description: "λ" },
    { label: "\\mu", value: "\\mu", description: "μ" },
    { label: "\\nu", value: "\\nu", description: "ν" },
    { label: "\\xi", value: "\\xi", description: "ξ" },
    { label: "\\pi", value: "\\pi", description: "π" },
    { label: "\\rho", value: "\\rho", description: "ρ" },
    { label: "\\sigma", value: "\\sigma", description: "σ" },
    { label: "\\tau", value: "\\tau", description: "τ" },
    { label: "\\upsilon", value: "\\upsilon", description: "υ" },
    { label: "\\phi", value: "\\phi", description: "ϕ" },
    { label: "\\chi", value: "\\chi", description: "χ" },
    { label: "\\psi", value: "\\psi", description: "ψ" },
    { label: "\\omega", value: "\\omega", description: "ω" },
    { label: "\\Gamma", value: "\\Gamma", description: "Γ" },
    { label: "\\Delta", value: "\\Delta", description: "Δ" },
    { label: "\\Theta", value: "\\Theta", description: "Θ" },
    { label: "\\Lambda", value: "\\Lambda", description: "Λ" },
    { label: "\\Xi", value: "\\Xi", description: "Ξ" },
    { label: "\\Pi", value: "\\Pi", description: "Π" },
    { label: "\\Sigma", value: "\\Sigma", description: "Σ" },
    { label: "\\Phi", value: "\\Phi", description: "Φ" },
    { label: "\\Psi", value: "\\Psi", description: "Ψ" },
    { label: "\\Omega", value: "\\Omega", description: "Ω" },

    // Operators
    { label: "\\sum", value: "\\sum", description: "Summation" },
    { label: "\\prod", value: "\\prod", description: "Product" },
    { label: "\\int", value: "\\int", description: "Integral" },
    { label: "\\sqrt", value: "\\sqrt{}", description: "Square Root" },
    { label: "\\frac", value: "\\frac{}{}", description: "Fraction" },
    { label: "\\pm", value: "\\pm", description: "±" },
    { label: "\\times", value: "\\times", description: "×" },
    { label: "\\div", value: "\\div", description: "÷" },
    { label: "\\cdot", value: "\\cdot", description: "·" },

    // Relations
    { label: "\\neq", value: "\\neq", description: "≠" },
    { label: "\\leq", value: "\\leq", description: "≤" },
    { label: "\\geq", value: "\\geq", description: "≥" },
    { label: "\\in", value: "\\in", description: "∈" },
    { label: "\\notin", value: "\\notin", description: "∉" },
    { label: "\\subset", value: "\\subset", description: "⊂" },
    { label: "\\subseteq", value: "\\subseteq", description: "⊆" },
    { label: "\\approx", value: "\\approx", description: "≈" },
    { label: "\\infty", value: "\\infty", description: "∞" },

    // Arrows
    { label: "\\rightarrow", value: "\\rightarrow", description: "→" },
    { label: "\\leftarrow", value: "\\leftarrow", description: "←" },
    { label: "\\Rightarrow", value: "\\Rightarrow", description: "⇒" },
    { label: "\\Leftrightarrow", value: "\\Leftrightarrow", description: "⇔" },

    // Logic
    { label: "\\forall", value: "\\forall", description: "∀" },
    { label: "\\exists", value: "\\exists", description: "∃" },
];
