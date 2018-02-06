const jwt = require('jsonwebtoken');
let pk = "-----BEGIN RSA PRIVATE KEY-----" +
    "MIIBOAIBAAJAeTqE6nHCxF+B4NZhV2B/5lD8sjY5w8q34stMCYP7urQrzubqdcz8" +
    "kZNaygp1VTeCsaijCyXqguzwiBccRpuV7QIDAQABAkAdQJeuEsFSrVEjtddLREfY" +
    "hZZUUm1h51qz6SZx7V0i0d3D9RPUdv63xaWcKClGCXiXX9URUmQoSVb0hrGzHUpB" +
    "AiEAvDTO+TUr68z5yRD2mhMJRCGltAOdF1e4U5dXzD35YrkCIQCk5XO7nLoCL6mj" +
    "TndC3BX7+6fy7aRitvM5nKOgjo8C1QIgXPYsoXV9C0zEuGbzl6j9c7S291KtnmEK" +
    "v+dKS6z06KkCIF+4Hh1rFgLM3iFBHDPAhDZ41/5JeqIe50OrLMS33EZdAiBXkxWp" +
    "fyltqTUDxn/vpjwpVTyQiumGfVGL7v/Oxnek0Q==" +
    "-----END RSA PRIVATE KEY-----";
let lk = "-----BEGIN PUBLIC KEY-----" +
    "MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAeTqE6nHCxF+B4NZhV2B/5lD8sjY5w8q3" +
    "4stMCYP7urQrzubqdcz8kZNaygp1VTeCsaijCyXqguzwiBccRpuV7QIDAQAB" +
    "-----END PUBLIC KEY-----" ;

let token = jwt.sign({foo: 'bar'}, pk, {algorithm: 'RS256'});
console.log(token);

console.log(jwt.verify(token, lk, {algorithm: 'RS256'}));