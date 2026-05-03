// Dependency Visualization System

class DependencyVisualizer {
    constructor() {
        this.svgNamespace = 'http://www.w3.org/2000/svg';
    }

    // Create dependency graph visualization
    createDependencyGraph(containerId, dependencyGraph) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Create SVG element
        const svg = document.createElementNS(this.svgNamespace, 'svg');
        svg.setAttribute('width', '800');
        svg.setAttribute('height', '600');
        svg.setAttribute('viewBox', '0 0 800 600');
        svg.style.border = '1px solid #ddd';
        svg.style.borderRadius = '8px';

        // Create graph layout
        const layout = this.calculateLayout(dependencyGraph);
        
        // Draw edges (connections)
        dependencyGraph.edges.forEach(edge => {
            const sourceNode = layout.nodes.find(n => n.id === edge.source);
            const targetNode = layout.nodes.find(n => n.id === edge.target);
            
            if (sourceNode && targetNode) {
                this.drawEdge(svg, sourceNode, targetNode, edge);
            }
        });

        // Draw nodes (artifacts)
        layout.nodes.forEach(node => {
            this.drawNode(svg, node, dependencyGraph);
        });

        // Add legend
        this.drawLegend(svg);

        container.appendChild(svg);
    }

    // Calculate layout for nodes
    calculateLayout(dependencyGraph) {
        const nodes = dependencyGraph.nodes.map((node, index) => {
            const typeColors = {
                'requirement': '#3498db',
                'design_module': '#9b59b6',
                'source_code': '#2ecc71',
                'test_case': '#f39c12',
                'documentation': '#e74c3c'
            };

            // Simple circular layout
            const angle = (index / dependencyGraph.nodes.length) * 2 * Math.PI;
            const radius = 200;
            const centerX = 400;
            const centerY = 300;

            return {
                ...node,
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
                color: typeColors[node.type] || '#95a5a6'
            };
        });

        return { nodes };
    }

    // Draw node (artifact)
    drawNode(svg, node, dependencyGraph) {
        const group = document.createElementNS(this.svgNamespace, 'g');
        
        // Node circle
        const circle = document.createElementNS(this.svgNamespace, 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', '30');
        circle.setAttribute('fill', node.color);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        circle.style.cursor = 'pointer';
        
        // Add hover effect
        circle.addEventListener('mouseenter', () => {
            circle.setAttribute('r', '35');
            this.showTooltip(svg, node, dependencyGraph);
        });
        
        circle.addEventListener('mouseleave', () => {
            circle.setAttribute('r', '30');
            this.hideTooltip();
        });

        // Node text (shortened)
        const text = document.createElementNS(this.svgNamespace, 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '10');
        text.setAttribute('font-weight', 'bold');
        text.textContent = this.shortenText(node.name, 8);

        group.appendChild(circle);
        group.appendChild(text);
        svg.appendChild(group);
    }

    // Draw edge (connection)
    drawEdge(svg, sourceNode, targetNode, edge) {
        const line = document.createElementNS(this.svgNamespace, 'line');
        line.setAttribute('x1', sourceNode.x);
        line.setAttribute('y1', sourceNode.y);
        line.setAttribute('x2', targetNode.x);
        line.setAttribute('y2', targetNode.y);
        
        // Style based on dependency type
        const edgeStyles = {
            'implements': { stroke: '#2ecc71', strokeWidth: '3', strokeDasharray: 'none' },
            'uses': { stroke: '#3498db', strokeWidth: '2', strokeDasharray: '5,5' },
            'tests': { stroke: '#f39c12', strokeWidth: '2', strokeDasharray: '10,5' },
            'documents': { stroke: '#9b59b6', strokeWidth: '1', strokeDasharray: '2,2' },
            'validates': { stroke: '#e74c3c', strokeWidth: '2', strokeDasharray: 'none' }
        };

        const style = edgeStyles[edge.type] || edgeStyles['uses'];
        line.setAttribute('stroke', style.stroke);
        line.setAttribute('stroke-width', style.strokeWidth);
        line.setAttribute('stroke-dasharray', style.strokeDasharray);
        line.style.opacity = '0.7';

        // Add arrowhead
        this.drawArrowhead(svg, sourceNode, targetNode, style.stroke);

        svg.appendChild(line);
    }

    // Draw arrowhead
    drawArrowhead(svg, sourceNode, targetNode, color) {
        const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
        const arrowLength = 10;
        const arrowAngle = Math.PI / 6;

        // Calculate arrow position (near target)
        const arrowX = targetNode.x - 35 * Math.cos(angle);
        const arrowY = targetNode.y - 35 * Math.sin(angle);

        // Create arrow path
        const path = document.createElementNS(this.svgNamespace, 'path');
        const x1 = arrowX;
        const y1 = arrowY;
        const x2 = x1 - arrowLength * Math.cos(angle - arrowAngle);
        const y2 = y1 - arrowLength * Math.sin(angle - arrowAngle);
        const x3 = x1 - arrowLength * Math.cos(angle + arrowAngle);
        const y3 = y1 - arrowLength * Math.sin(angle + arrowAngle);

        path.setAttribute('d', `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`);
        path.setAttribute('fill', color);
        path.style.opacity = '0.7';

        svg.appendChild(path);
    }

    // Draw legend
    drawLegend(svg) {
        const legendData = [
            { type: 'requirement', label: 'Requirements', color: '#3498db' },
            { type: 'design_module', label: 'Design Modules', color: '#9b59b6' },
            { type: 'source_code', label: 'Source Code', color: '#2ecc71' },
            { type: 'test_case', label: 'Test Cases', color: '#f39c12' },
            { type: 'documentation', label: 'Documentation', color: '#e74c3c' }
        ];

        const legendGroup = document.createElementNS(this.svgNamespace, 'g');
        legendGroup.setAttribute('transform', 'translate(20, 20)');

        legendData.forEach((item, index) => {
            const y = index * 25;

            // Legend item circle
            const circle = document.createElementNS(this.svgNamespace, 'circle');
            circle.setAttribute('cx', '10');
            circle.setAttribute('cy', y);
            circle.setAttribute('r', '8');
            circle.setAttribute('fill', item.color);

            // Legend item text
            const text = document.createElementNS(this.svgNamespace, 'text');
            text.setAttribute('x', '25');
            text.setAttribute('y', y + 4);
            text.setAttribute('font-size', '12');
            text.setAttribute('fill', '#333');
            text.textContent = item.label;

            legendGroup.appendChild(circle);
            legendGroup.appendChild(text);
        });

        svg.appendChild(legendGroup);
    }

    // Show tooltip
    showTooltip(svg, node, dependencyGraph) {
        // Remove existing tooltip
        this.hideTooltip();

        const tooltip = document.createElementNS(this.svgNamespace, 'g');
        tooltip.setAttribute('id', 'tooltip');

        // Tooltip background
        const rect = document.createElementNS(this.svgNamespace, 'rect');
        rect.setAttribute('x', node.x + 40);
        rect.setAttribute('y', node.y - 40);
        rect.setAttribute('width', '200');
        rect.setAttribute('height', '80');
        rect.setAttribute('fill', 'white');
        rect.setAttribute('stroke', '#333');
        rect.setAttribute('stroke-width', '1');
        rect.setAttribute('rx', '5');

        // Tooltip text
        const text1 = document.createElementNS(this.svgNamespace, 'text');
        text1.setAttribute('x', node.x + 50);
        text1.setAttribute('y', node.y - 20);
        text1.setAttribute('font-size', '12');
        text1.setAttribute('font-weight', 'bold');
        text1.setAttribute('fill', '#333');
        text1.textContent = node.name;

        const text2 = document.createElementNS(this.svgNamespace, 'text');
        text2.setAttribute('x', node.x + 50);
        text2.setAttribute('y', node.y - 5);
        text2.setAttribute('font-size', '10');
        text2.setAttribute('fill', '#666');
        text2.textContent = `Type: ${node.type}`;

        const text3 = document.createElementNS(this.svgNamespace, 'text');
        text3.setAttribute('x', node.x + 50);
        text3.setAttribute('y', node.y + 10);
        text3.setAttribute('font-size', '10');
        text3.setAttribute('fill', '#666');
        text3.textContent = `Status: ${node.status}`;

        const text4 = document.createElementNS(this.svgNamespace, 'text');
        text4.setAttribute('x', node.x + 50);
        text4.setAttribute('y', node.y + 25);
        text4.setAttribute('font-size', '10');
        text4.setAttribute('fill', '#666');
        text4.textContent = `Version: ${node.version}`;

        tooltip.appendChild(rect);
        tooltip.appendChild(text1);
        tooltip.appendChild(text2);
        tooltip.appendChild(text3);
        tooltip.appendChild(text4);

        svg.appendChild(tooltip);
    }

    // Hide tooltip
    hideTooltip() {
        const existingTooltip = document.getElementById('tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
    }

    // Shorten text for display
    shortenText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength - 3) + '...';
    }

    // Create artifact list view
    createArtifactList(containerId, artifacts) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }

        container.innerHTML = '';

        if (artifacts.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">No artifacts found.</p>';
            return;
        }

        const groupedArtifacts = this.groupArtifactsByType(artifacts);

        Object.keys(groupedArtifacts).forEach(type => {
            const typeSection = document.createElement('div');
            typeSection.style.marginBottom = '20px';

            const typeHeader = document.createElement('h3');
            typeHeader.textContent = this.formatArtifactType(type);
            typeHeader.style.color = '#333';
            typeHeader.style.borderBottom = '2px solid #667eea';
            typeHeader.style.paddingBottom = '5px';

            const artifactList = document.createElement('div');
            artifactList.style.display = 'grid';
            artifactList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
            artifactList.style.gap = '10px';

            groupedArtifacts[type].forEach(artifact => {
                const artifactCard = this.createArtifactCard(artifact);
                artifactList.appendChild(artifactCard);
            });

            typeSection.appendChild(typeHeader);
            typeSection.appendChild(artifactList);
            container.appendChild(typeSection);
        });
    }

    // Group artifacts by type
    groupArtifactsByType(artifacts) {
        const grouped = {};
        artifacts.forEach(artifact => {
            if (!grouped[artifact.type]) {
                grouped[artifact.type] = [];
            }
            grouped[artifact.type].push(artifact);
        });
        return grouped;
    }

    // Create artifact card
    createArtifactCard(artifact) {
        const card = document.createElement('div');
        card.style.background = 'white';
        card.style.border = '1px solid #ddd';
        card.style.borderRadius = '8px';
        card.style.padding = '15px';
        card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

        const typeColors = {
            'requirement': '#3498db',
            'design_module': '#9b59b6',
            'source_code': '#2ecc71',
            'test_case': '#f39c12',
            'documentation': '#e74c3c'
        };

        const color = typeColors[artifact.type] || '#95a5a6';

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '10px';

        const title = document.createElement('h4');
        title.textContent = artifact.name;
        title.style.margin = '0';
        title.style.color = '#333';

        const typeBadge = document.createElement('span');
        typeBadge.textContent = artifact.type.replace('_', ' ').toUpperCase();
        typeBadge.style.background = color;
        typeBadge.style.color = 'white';
        typeBadge.style.padding = '3px 8px';
        typeBadge.style.borderRadius = '3px';
        typeBadge.style.fontSize = '10px';
        typeBadge.style.fontWeight = 'bold';

        const description = document.createElement('p');
        description.textContent = artifact.description;
        description.style.margin = '5px 0';
        description.style.color = '#666';
        description.style.fontSize = '12px';

        const meta = document.createElement('div');
        meta.style.display = 'flex';
        meta.style.justifyContent = 'space-between';
        meta.style.fontSize = '11px';
        meta.style.color = '#999';
        meta.style.marginTop = '10px';

        const version = document.createElement('span');
        version.textContent = `v${artifact.version}`;

        const status = document.createElement('span');
        status.textContent = artifact.status;
        status.style.fontWeight = 'bold';
        status.style.color = artifact.status === 'approved' ? '#27ae60' : '#f39c12';

        header.appendChild(title);
        header.appendChild(typeBadge);
        meta.appendChild(version);
        meta.appendChild(status);

        card.appendChild(header);
        card.appendChild(description);
        card.appendChild(meta);

        return card;
    }

    // Format artifact type for display
    formatArtifactType(type) {
        const types = {
            'requirement': 'Requirements',
            'design_module': 'Design Modules',
            'source_code': 'Source Code',
            'test_case': 'Test Cases',
            'documentation': 'Documentation'
        };
        return types[type] || type;
    }
}
