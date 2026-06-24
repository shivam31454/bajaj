var inputEl  = document.getElementById('nodeInput');
var btn      = document.getElementById('submitBtn');
var loader   = document.getElementById('loader');
var errorBox = document.getElementById('errorBox');
var results  = document.getElementById('results');

function parseInput(raw) {
    // if user pasted JSON like {"data": ["A->B", ...]} handle it
    var trimmed = raw.trim();
    if (trimmed.charAt(0) === '{' || trimmed.charAt(0) === '[') {
        try {
            var parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed;
            if (parsed.data && Array.isArray(parsed.data)) return parsed.data;
        } catch (e) {
            // not valid json, fall through to normal split
        }
    }
    return raw.split(/[,\n]+/).map(function(s) { return s.trim(); }).filter(Boolean);
}

async function submitData() {
    var raw = inputEl.value.trim();
    if (!raw) return;

    var items = parseInput(raw);

    errorBox.classList.add('hidden');
    results.classList.add('hidden');
    loader.classList.remove('hidden');
    btn.disabled = true;

    try {
        var resp = await fetch('/bfhl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: items })
        });

        if (!resp.ok) {
            var errData = await resp.json().catch(function() { return null; });
            throw new Error(errData ? errData.error : 'Server error ' + resp.status);
        }

        var data = await resp.json();
        showResults(data);

    } catch (err) {
        errorBox.textContent = err.message;
        errorBox.classList.remove('hidden');
    } finally {
        loader.classList.add('hidden');
        btn.disabled = false;
    }
}

function showResults(data) {
    // user info
    var infoDiv = document.getElementById('userInfo');
    infoDiv.innerHTML =
        '<div class="info-pair"><span class="lbl">User:</span><span class="val">' + esc(data.user_id) + '</span></div>' +
        '<div class="info-pair"><span class="lbl">Email:</span><span class="val">' + esc(data.email_id) + '</span></div>' +
        '<div class="info-pair"><span class="lbl">Roll No:</span><span class="val">' + esc(data.college_roll_number) + '</span></div>';

    // summary
    var s = data.summary;
    var sumDiv = document.getElementById('summaryBlock');
    sumDiv.innerHTML =
        '<div class="stat-box trees"><div class="num">' + s.total_trees + '</div><div class="label">Trees</div></div>' +
        '<div class="stat-box cycles"><div class="num">' + s.total_cycles + '</div><div class="label">Cycles</div></div>' +
        '<div class="stat-box root"><div class="num">' + (s.largest_tree_root || '—') + '</div><div class="label">Largest Tree Root</div></div>';

    // hierarchies
    var hierDiv = document.getElementById('hierList');
    hierDiv.innerHTML = '';

    for (var i = 0; i < data.hierarchies.length; i++) {
        var h = data.hierarchies[i];
        var isCycle = h.has_cycle === true;

        var card = document.createElement('div');
        card.className = 'hier-card';

        var bodyContent = '';
        if (isCycle) {
            bodyContent = '<div class="cycle-note"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg> Cycle detected — no tree structure</div>';
        } else {
            var treeStr = drawTree(h.tree);
            bodyContent = '<pre>' + treeStr + '</pre><div class="depth-info">Depth: <span>' + h.depth + '</span></div>';
        }

        card.innerHTML =
            '<div class="hier-top">' +
                '<span class="root-label">Root: ' + esc(h.root) + '</span>' +
                '<span class="badge ' + (isCycle ? 'cycle' : 'tree') + '">' + (isCycle ? 'Cycle' : 'Tree') + '</span>' +
            '</div>' +
            '<div class="hier-body">' + bodyContent + '</div>';

        hierDiv.appendChild(card);
    }

    // invalid entries
    var invDiv = document.getElementById('invalidBlock');
    invDiv.innerHTML = '<h4>Invalid Entries</h4>' + makeTags(data.invalid_entries, 'invalid');

    // duplicates
    var dupeDiv = document.getElementById('dupeBlock');
    dupeDiv.innerHTML = '<h4>Duplicate Edges</h4>' + makeTags(data.duplicate_edges, 'dupe');

    results.classList.remove('hidden');
}

function makeTags(arr, cls) {
    if (!arr || arr.length === 0) return '<span class="none-msg">None</span>';
    var html = '<div class="tag-list">';
    for (var i = 0; i < arr.length; i++) {
        html += '<span class="tag ' + cls + '">' + esc(String(arr[i])) + '</span>';
    }
    html += '</div>';
    return html;
}

// draw ascii tree
function drawTree(treeObj) {
    var keys = Object.keys(treeObj);
    if (keys.length === 0) return '(empty)';
    var root = keys[0];
    return esc(root) + '\n' + drawKids(treeObj[root], '');
}

function drawKids(obj, prefix) {
    var keys = Object.keys(obj);
    var out = '';
    for (var i = 0; i < keys.length; i++) {
        var last = (i === keys.length - 1);
        var connector = '<span class="connector">' + (last ? '└── ' : '├── ') + '</span>';
        var nextPrefix = prefix + (last ? '    ' : '<span class="connector">│</span>   ');
        out += prefix + connector + esc(keys[i]) + '\n';
        out += drawKids(obj[keys[i]], nextPrefix);
    }
    return out;
}

function esc(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

inputEl.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') submitData();
});
