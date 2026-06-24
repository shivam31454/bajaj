require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// helpers
function buildNested(node, adj) {
    const obj = {};
    const kids = adj[node] || [];
    for (const kid of kids) {
        obj[kid] = buildNested(kid, adj);
    }
    return obj;
}

function calcDepth(node, adj) {
    const kids = adj[node] || [];
    if (kids.length === 0) return 1;
    let mx = 0;
    for (const k of kids) {
        mx = Math.max(mx, calcDepth(k, adj));
    }
    return 1 + mx;
}

app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});

app.post('/bfhl', (req, res) => {
    try {
        const data = req.body.data;
        if (!Array.isArray(data)) {
            return res.status(400).json({ error: 'data must be an array' });
        }

        const invalidEntries = [];
        const duplicateEdges = [];
        const seen = new Set();
        const dupeTracker = new Set();
        const validEdges = [];

        // step 1 — validate and deduplicate
        for (const item of data) {
            if (typeof item !== 'string') {
                invalidEntries.push(item);
                continue;
            }

            const trimmed = item.trim();

            // must be exactly X->Y where X,Y are single uppercase letters
            if (!trimmed || !/^[A-Z]->[A-Z]$/.test(trimmed)) {
                invalidEntries.push(item);
                continue;
            }

            const parts = trimmed.split('->');
            const from = parts[0];
            const to = parts[1];

            // self-loop is invalid
            if (from === to) {
                invalidEntries.push(item);
                continue;
            }

            const key = from + '->' + to;

            if (seen.has(key)) {
                if (!dupeTracker.has(key)) {
                    duplicateEdges.push(key);
                    dupeTracker.add(key);
                }
                continue;
            }

            seen.add(key);
            validEdges.push({ from, to });
        }

        // step 2 — multi-parent handling + adjacency list
        const adj = {};       // parent -> [children] in encounter order
        const parentOf = {};  // child -> its first parent
        const usedEdges = [];

        for (const edge of validEdges) {
            if (parentOf[edge.to] !== undefined) {
                continue; // child already claimed, silently discard
            }
            parentOf[edge.to] = edge.from;
            if (!adj[edge.from]) adj[edge.from] = [];
            adj[edge.from].push(edge.to);
            usedEdges.push(edge);
        }

        // step 3 — gather nodes in encounter order
        const allNodes = [];
        const nodeSet = new Set();
        for (const e of usedEdges) {
            if (!nodeSet.has(e.from)) { allNodes.push(e.from); nodeSet.add(e.from); }
            if (!nodeSet.has(e.to))   { allNodes.push(e.to);   nodeSet.add(e.to);   }
        }

        // undirected graph for finding connected components
        const neighbors = {};
        for (const n of allNodes) neighbors[n] = [];
        for (const e of usedEdges) {
            neighbors[e.from].push(e.to);
            neighbors[e.to].push(e.from);
        }

        // BFS to find components in encounter order
        const visited = new Set();
        const components = [];

        for (const start of allNodes) {
            if (visited.has(start)) continue;
            const group = [];
            const queue = [start];
            visited.add(start);
            while (queue.length) {
                const curr = queue.shift();
                group.push(curr);
                for (const nb of neighbors[curr]) {
                    if (!visited.has(nb)) {
                        visited.add(nb);
                        queue.push(nb);
                    }
                }
            }
            components.push(group);
        }

        // step 4 — build hierarchy for each component
        const hierarchies = [];

        for (const group of components) {
            const roots = group.filter(n => parentOf[n] === undefined);

            if (roots.length === 0) {
                // pure cycle — every node is someone's child
                const sorted = [...group].sort();
                hierarchies.push({
                    root: sorted[0],
                    tree: {},
                    has_cycle: true
                });
            } else {
                const root = roots[0];
                const treeObj = {};
                treeObj[root] = buildNested(root, adj);
                const d = calcDepth(root, adj);

                hierarchies.push({
                    root: root,
                    tree: treeObj,
                    depth: d
                });
            }
        }

        // step 5 — summary
        const treesOnly = hierarchies.filter(h => !h.has_cycle);
        const cycleCount = hierarchies.length - treesOnly.length;

        let biggestRoot = '';
        let biggestDepth = 0;
        for (const t of treesOnly) {
            if (t.depth > biggestDepth || (t.depth === biggestDepth && t.root < biggestRoot)) {
                biggestDepth = t.depth;
                biggestRoot = t.root;
            }
        }

        res.json({
            user_id: process.env.USER_ID,
            email_id: process.env.EMAIL_ID,
            college_roll_number: process.env.COLLEGE_ROLL_NUMBER,
            hierarchies,
            invalid_entries: invalidEntries,
            duplicate_edges: duplicateEdges,
            summary: {
                total_trees: treesOnly.length,
                total_cycles: cycleCount,
                largest_tree_root: biggestRoot
            }
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Something went wrong processing your request' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});
