function probability(n) {
    return !!n && Math.random() <= n;
}

function seldom() {
    return probability(0.1);
}

function occasionally() {
    return probability(0.3);
}

export {seldom, occasionally}