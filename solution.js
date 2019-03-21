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

    getCutOffNodes() {
        const visibleNodes = this.getVisibleNodes();

        return this.nodes
            .filter(({ to }) => !visibleNodes.includes(to))
            .map(({ to }) => to);
    }

    getVisibleNodes(start = this.start, existingNodes = [this.start]) {
        const nodes = this.nodes
            .filter(({ from }) => from === start)
            .filter(({ to }) => !existingNodes.includes(to))
            .filter(({ capacity }) => capacity > 0)
            .map(({ to }) => to);

        nodes.forEach(node => {
            nodes.push(...this.getVisibleNodes(node, [...nodes, ...existingNodes]));
        });

        return nodes;
    }

    getPath(start = this.start, end = this.end, currentPath = [start]) {
        const linkedNodes = this.nodes
            .filter(({ from }) => from === start)
            .filter(({ to }) => !currentPath.includes(to))
            .filter(({ capacity }) => capacity > 0);

        for (let i = 0; i < linkedNodes.length; i++) {
            const node = linkedNodes[i];
            const testPath = [...currentPath, node.to];

            if (node.to === end) {
                return testPath;
            }

            const path = this.getPath(node.to, end, testPath);

            if (path) return path;
        }

        return null;
    }

    getLink(start, end) {
        return this.nodes.find(({ from, to }) => from === start && end === to);
    }

    getPathCapacity(path) {
        let capacity = Infinity;

        for (let i = 1; i < path.length; i++) {
            capacity = Math.min(
                capacity,
                this.getLink(path[i - 1], path[i]).capacity
            );
        }

        return capacity;
    }

    removePathCapacity(path, amount) {
        for (let i = 1; i < path.length; i++) {
            this.getLink(path[i - 1], path[i]).capacity -= amount;
        }
    }

    getMaxFlow() {
        let path;
        let maxFlow = 0;

        while(path = this.getPath()) {
            const capacity = this.getPathCapacity(path);

            this.removePathCapacity(path, capacity);

            maxFlow += capacity;
        }

        return maxFlow;
    }

    getMinCut() {
        const visibleNodes = this.getVisibleNodes();
        const cutOffNode = this.getCutOffNodes();

        return this.nodes
            .filter(({ from }) => visibleNodes.includes(from))
            .filter(({ to }) => cutOffNode.includes(to));
    }
}

const maxFlow = new MaxFlow(jsonNodes, 0, 9);

console.log(maxFlow.getMaxFlow());

console.log(maxFlow.getMinCut());
