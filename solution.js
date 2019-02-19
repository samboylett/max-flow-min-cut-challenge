const jsonNodes = [
    {from: 0, to: 1, capacity: 123},
    {from: 0, to: 2, capacity: 32},
    {from: 1, to: 2, capacity: 12},
    {from: 1, to: 4, capacity: 45},
    {from: 2, to: 3, capacity: 3},
    {from: 3, to: 6, capacity: 27},
    {from: 3, to: 9, capacity: 2},
    {from: 4, to: 5, capacity: 30},
    {from: 4, to: 7, capacity: 5},
    {from: 5, to: 6, capacity: 97},
    {from: 5, to: 8, capacity: 54},
    {from: 6, to: 9, capacity: 15},
    {from: 7, to: 8, capacity: 10},
    {from: 8, to: 9, capacity: 9},
    {from: 5, to: 7, capacity: 36},
    {from: 5, to: 1, capacity: 57},
    {from: 8, to: 5, capacity: 3},
];

class MaxFlow {
    constructor(nodes, start, end) {
        this.nodes = nodes;
        this.start = start;
        this.end = end;

        this.paths = this.getPaths(start);
    }

    getPaths(nodeId, done = []) {
        return jsonNodes
            .filter(({ from, to }) => from === nodeId && !done.includes(to))
            .map(node => ({
                id: node.to,
                capacity: node.capacity,
                paths: node.to === this.end ? [] : this.getPaths(node.to, [...done, nodeId]),
            }));
    }

    // getMaxFlow(path = this.paths, ) {

    // }
}

const maxFlow = new MaxFlow(jsonNodes, 0, 9);

console.log(JSON.stringify(maxFlow.paths, null, 2));
