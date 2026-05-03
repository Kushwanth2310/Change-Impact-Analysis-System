// Artifact Management System for CIAS

class ArtifactManager {
    constructor() {
        this.artifactsStorageKey = 'cias_artifacts';
        this.dependenciesStorageKey = 'cias_artifact_dependencies';
        this.changeRequestArtifactsKey = 'cias_change_request_artifacts';
        this.initializeDummyData();
    }

    // Initialize dummy data for testing
    initializeDummyData() {
        if (!localStorage.getItem(this.artifactsStorageKey)) {
            this.createDummyArtifacts();
        }
        if (!localStorage.getItem(this.dependenciesStorageKey)) {
            this.createDummyDependencies();
        }
    }

    // Create dummy artifacts
    createDummyArtifacts() {
        const dummyArtifacts = [
            // Requirements
            {
                id: 'REQ-001',
                name: 'User Authentication Requirements',
                type: 'requirement',
                description: 'Requirements for user login and authentication system',
                version: '1.0',
                status: 'approved',
                createdBy: 'admin',
                createdAt: '2026-04-01T10:00:00Z',
                updatedAt: '2026-04-01T10:00:00Z'
            },
            {
                id: 'REQ-002',
                name: 'Data Security Requirements',
                type: 'requirement',
                description: 'Security requirements for data protection and encryption',
                version: '1.2',
                status: 'approved',
                createdBy: 'admin',
                createdAt: '2026-04-02T11:00:00Z',
                updatedAt: '2026-04-05T14:30:00Z'
            },
            {
                id: 'REQ-003',
                name: 'Performance Requirements',
                type: 'requirement',
                description: 'System performance and response time requirements',
                version: '1.0',
                status: 'draft',
                createdBy: 'project_manager',
                createdAt: '2026-04-10T09:00:00Z',
                updatedAt: '2026-04-10T09:00:00Z'
            },

            // Design Modules
            {
                id: 'DES-001',
                name: 'Authentication Module Design',
                type: 'design_module',
                description: 'UML diagrams and architecture for authentication system',
                version: '2.1',
                status: 'approved',
                createdBy: 'designer',
                createdAt: '2026-04-03T10:00:00Z',
                updatedAt: '2026-04-08T16:00:00Z'
            },
            {
                id: 'DES-002',
                name: 'Database Schema Design',
                type: 'design_module',
                description: 'Database schema and entity relationship diagrams',
                version: '1.5',
                status: 'approved',
                createdBy: 'designer',
                createdAt: '2026-04-04T13:00:00Z',
                updatedAt: '2026-04-12T10:00:00Z'
            },
            {
                id: 'DES-003',
                name: 'API Interface Design',
                type: 'design_module',
                description: 'RESTful API design and documentation',
                version: '1.0',
                status: 'draft',
                createdBy: 'developer',
                createdAt: '2026-04-11T15:00:00Z',
                updatedAt: '2026-04-11T15:00:00Z'
            },

            // Source Code Files
            {
                id: 'SRC-001',
                name: 'AuthService.js',
                type: 'source_code',
                description: 'JavaScript authentication service implementation',
                version: '3.2',
                status: 'approved',
                createdBy: 'developer',
                createdAt: '2026-04-05T09:00:00Z',
                updatedAt: '2026-04-15T11:00:00Z'
            },
            {
                id: 'SRC-002',
                name: 'UserController.js',
                type: 'source_code',
                description: 'User management controller class',
                version: '2.1',
                status: 'approved',
                createdBy: 'developer',
                createdAt: '2026-04-06T10:00:00Z',
                updatedAt: '2026-04-14T14:00:00Z'
            },
            {
                id: 'SRC-003',
                name: 'DatabaseManager.js',
                type: 'source_code',
                description: 'Database connection and query management',
                version: '1.8',
                status: 'approved',
                createdBy: 'developer',
                createdAt: '2026-04-07T11:00:00Z',
                updatedAt: '2026-04-13T09:00:00Z'
            },
            {
                id: 'SRC-004',
                name: 'SecurityUtils.js',
                type: 'source_code',
                description: 'Security utility functions and encryption',
                version: '1.0',
                status: 'draft',
                createdBy: 'developer',
                createdAt: '2026-04-12T16:00:00Z',
                updatedAt: '2026-04-12T16:00:00Z'
            },

            // Test Cases
            {
                id: 'TEST-001',
                name: 'Login Functionality Tests',
                type: 'test_case',
                description: 'Unit tests for login authentication',
                version: '2.0',
                status: 'approved',
                createdBy: 'tester',
                createdAt: '2026-04-08T08:00:00Z',
                updatedAt: '2026-04-16T10:00:00Z'
            },
            {
                id: 'TEST-002',
                name: 'Security Tests',
                type: 'test_case',
                description: 'Security vulnerability and penetration tests',
                version: '1.1',
                status: 'approved',
                createdBy: 'tester',
                createdAt: '2026-04-09T10:00:00Z',
                updatedAt: '2026-04-17T14:00:00Z'
            },
            {
                id: 'TEST-003',
                name: 'Performance Tests',
                type: 'test_case',
                description: 'Load testing and performance benchmarks',
                version: '1.0',
                status: 'draft',
                createdBy: 'tester',
                createdAt: '2026-04-13T12:00:00Z',
                updatedAt: '2026-04-13T12:00:00Z'
            },

            // Documentation
            {
                id: 'DOC-001',
                name: 'User Manual',
                type: 'documentation',
                description: 'End-user documentation and user guide',
                version: '1.3',
                status: 'approved',
                createdBy: 'writer',
                createdAt: '2026-04-10T14:00:00Z',
                updatedAt: '2026-04-18T09:00:00Z'
            },
            {
                id: 'DOC-002',
                name: 'API Documentation',
                type: 'documentation',
                description: 'Technical API reference documentation',
                version: '2.0',
                status: 'approved',
                createdBy: 'developer',
                createdAt: '2026-04-11T11:00:00Z',
                updatedAt: '2026-04-19T15:00:00Z'
            },
            {
                id: 'DOC-003',
                name: 'Installation Guide',
                type: 'documentation',
                description: 'System installation and setup documentation',
                version: '1.0',
                status: 'draft',
                createdBy: 'writer',
                createdAt: '2026-04-14T13:00:00Z',
                updatedAt: '2026-04-14T13:00:00Z'
            }
        ];

        localStorage.setItem(this.artifactsStorageKey, JSON.stringify(dummyArtifacts));
    }

    // Create dummy dependencies
    createDummyDependencies() {
        const dummyDependencies = [
            // Authentication dependencies
            {
                id: 'DEP-001',
                sourceArtifactId: 'REQ-001',
                targetArtifactId: 'DES-001',
                type: 'implements',
                strength: 'strong',
                description: 'Authentication module design implements user authentication requirements'
            },
            {
                id: 'DEP-002',
                sourceArtifactId: 'DES-001',
                targetArtifactId: 'SRC-001',
                type: 'implements',
                strength: 'strong',
                description: 'AuthService implements authentication module design'
            },
            {
                id: 'DEP-003',
                sourceArtifactId: 'SRC-001',
                targetArtifactId: 'TEST-001',
                type: 'tests',
                strength: 'medium',
                description: 'Login tests validate AuthService functionality'
            },

            // Security dependencies
            {
                id: 'DEP-004',
                sourceArtifactId: 'REQ-002',
                targetArtifactId: 'SRC-004',
                type: 'implements',
                strength: 'strong',
                description: 'SecurityUtils implements data security requirements'
            },
            {
                id: 'DEP-005',
                sourceArtifactId: 'SRC-004',
                targetArtifactId: 'TEST-002',
                type: 'tests',
                strength: 'strong',
                description: 'Security tests validate SecurityUtils functionality'
            },

            // Database dependencies
            {
                id: 'DEP-006',
                sourceArtifactId: 'DES-002',
                targetArtifactId: 'SRC-003',
                type: 'implements',
                strength: 'strong',
                description: 'DatabaseManager implements database schema design'
            },
            {
                id: 'DEP-007',
                sourceArtifactId: 'SRC-003',
                targetArtifactId: 'SRC-001',
                type: 'uses',
                strength: 'medium',
                description: 'AuthService uses DatabaseManager for user data'
            },
            {
                id: 'DEP-008',
                sourceArtifactId: 'SRC-003',
                targetArtifactId: 'SRC-002',
                type: 'uses',
                strength: 'medium',
                description: 'UserController uses DatabaseManager for data operations'
            },

            // Documentation dependencies
            {
                id: 'DEP-009',
                sourceArtifactId: 'SRC-001',
                targetArtifactId: 'DOC-002',
                type: 'documents',
                strength: 'weak',
                description: 'API documentation covers AuthService methods'
            },
            {
                id: 'DEP-010',
                sourceArtifactId: 'DES-001',
                targetArtifactId: 'DOC-001',
                type: 'documents',
                strength: 'medium',
                description: 'User manual documents authentication features'
            },

            // Cross-cutting dependencies
            {
                id: 'DEP-011',
                sourceArtifactId: 'REQ-003',
                targetArtifactId: 'TEST-003',
                type: 'validates',
                strength: 'medium',
                description: 'Performance tests validate performance requirements'
            }
        ];

        localStorage.setItem(this.dependenciesStorageKey, JSON.stringify(dummyDependencies));
    }

    // Get all artifacts
    getArtifacts() {
        try {
            return JSON.parse(localStorage.getItem(this.artifactsStorageKey)) || [];
        } catch (error) {
            console.error('Error reading artifacts:', error);
            return [];
        }
    }

    // Get artifacts by type
    getArtifactsByType(type) {
        const artifacts = this.getArtifacts();
        return artifacts.filter(artifact => artifact.type === type);
    }

    // Get artifact by ID
    getArtifactById(artifactId) {
        const artifacts = this.getArtifacts();
        return artifacts.find(artifact => artifact.id === artifactId);
    }

    // Get all dependencies
    getDependencies() {
        try {
            return JSON.parse(localStorage.getItem(this.dependenciesStorageKey)) || [];
        } catch (error) {
            console.error('Error reading dependencies:', error);
            return [];
        }
    }

    // Get dependencies for artifact
    getArtifactDependencies(artifactId) {
        const dependencies = this.getDependencies();
        return dependencies.filter(dep => 
            dep.sourceArtifactId === artifactId || dep.targetArtifactId === artifactId
        );
    }

    // Get artifacts affected by change request
    getAffectedArtifacts(changeRequestId) {
        try {
            const changeRequestArtifacts = JSON.parse(localStorage.getItem(this.changeRequestArtifactsKey) || '[]');
            const artifactIds = changeRequestArtifacts
                .filter(cra => cra.changeRequestId === changeRequestId)
                .map(cra => cra.artifactId);
            
            const artifacts = this.getArtifacts();
            return artifacts.filter(artifact => artifactIds.includes(artifact.id));
        } catch (error) {
            console.error('Error reading affected artifacts:', error);
            return [];
        }
    }

    // Add artifact to change request
    addArtifactToChangeRequest(changeRequestId, artifactId, impactType = 'affected') {
        try {
            const changeRequestArtifacts = JSON.parse(localStorage.getItem(this.changeRequestArtifactsKey) || '[]');
            
            // Check if artifact already exists for this change request
            const existing = changeRequestArtifacts.find(cra => 
                cra.changeRequestId === changeRequestId && cra.artifactId === artifactId
            );
            
            if (existing) {
                return { success: false, message: 'Artifact already added to change request' };
            }
            
            const newEntry = {
                id: `CRA-${Date.now()}`,
                changeRequestId: changeRequestId,
                artifactId: artifactId,
                impactType: impactType,
                addedAt: new Date().toISOString()
            };
            
            changeRequestArtifacts.push(newEntry);
            localStorage.setItem(this.changeRequestArtifactsKey, JSON.stringify(changeRequestArtifacts));
            
            return { success: true, message: 'Artifact added to change request' };
        } catch (error) {
            console.error('Error adding artifact to change request:', error);
            return { success: false, message: 'Failed to add artifact to change request' };
        }
    }

    // Remove artifact from change request
    removeArtifactFromChangeRequest(changeRequestId, artifactId) {
        try {
            const changeRequestArtifacts = JSON.parse(localStorage.getItem(this.changeRequestArtifactsKey) || '[]');
            const filtered = changeRequestArtifacts.filter(cra => 
                !(cra.changeRequestId === changeRequestId && cra.artifactId === artifactId)
            );
            
            if (filtered.length === changeRequestArtifacts.length) {
                return { success: false, message: 'Artifact not found in change request' };
            }
            
            localStorage.setItem(this.changeRequestArtifactsKey, JSON.stringify(filtered));
            return { success: true, message: 'Artifact removed from change request' };
        } catch (error) {
            console.error('Error removing artifact from change request:', error);
            return { success: false, message: 'Failed to remove artifact from change request' };
        }
    }

    // Generate dependency view for artifacts
    generateDependencyView(artifactIds) {
        const artifacts = this.getArtifacts();
        const dependencies = this.getDependencies();
        
        // Get involved artifacts
        const involvedArtifacts = artifacts.filter(artifact => artifactIds.includes(artifact.id));
        
        // Get relevant dependencies
        const relevantDependencies = dependencies.filter(dep => 
            artifactIds.includes(dep.sourceArtifactId) && artifactIds.includes(dep.targetArtifactId)
        );
        
        // Build dependency graph
        const graph = {
            nodes: involvedArtifacts.map(artifact => ({
                id: artifact.id,
                name: artifact.name,
                type: artifact.type,
                status: artifact.status,
                version: artifact.version
            })),
            edges: relevantDependencies.map(dep => ({
                source: dep.sourceArtifactId,
                target: dep.targetArtifactId,
                type: dep.type,
                strength: dep.strength,
                description: dep.description
            }))
        };
        
        return graph;
    }

    // Automatically detect affected artifacts based on change request
    autoDetectAffectedArtifacts(changeRequest) {
        const allArtifacts = this.getArtifacts();
        const allDependencies = this.getDependencies();
        
        // Keywords for artifact type detection
        const keywordMappings = {
            'requirement': ['requirement', 'spec', 'specification', 'functional', 'user story'],
            'design_module': ['design', 'architecture', 'module', 'component', 'interface'],
            'source_code': ['code', 'function', 'class', 'method', 'algorithm', 'implementation'],
            'test_case': ['test', 'testing', 'unit test', 'integration', 'validation'],
            'documentation': ['documentation', 'manual', 'guide', 'readme', 'help']
        };
        
        // Analyze change request description and type
        const searchText = `${changeRequest.changeType} ${changeRequest.description}`.toLowerCase();
        const detectedArtifacts = [];
        
        // Keyword-based detection
        allArtifacts.forEach(artifact => {
            const artifactKeywords = keywordMappings[artifact.type] || [];
            const artifactText = `${artifact.name} ${artifact.description}`.toLowerCase();
            
            // Check if change request mentions artifact keywords
            const hasKeywordMatch = artifactKeywords.some(keyword => 
                searchText.includes(keyword) && artifactText.includes(keyword)
            );
            
            // Check if change request mentions artifact directly
            const hasDirectMatch = searchText.includes(artifact.name.toLowerCase()) ||
                                  artifact.name.toLowerCase().includes(searchText);
            
            if (hasKeywordMatch || hasDirectMatch) {
                detectedArtifacts.push({
                    ...artifact,
                    detectionReason: hasDirectMatch ? 'Direct mention' : 'Keyword match'
                });
            }
        });
        
        // Add related artifacts through dependencies
        const relatedArtifacts = [];
        detectedArtifacts.forEach(artifact => {
            const dependencies = this.getArtifactDependencies(artifact.id);
            dependencies.forEach(dep => {
                const relatedArtifact = this.getArtifactById(
                    dep.sourceArtifactId === artifact.id ? dep.targetArtifactId : dep.sourceArtifactId
                );
                if (relatedArtifact && !detectedArtifacts.find(a => a.id === relatedArtifact.id)) {
                    relatedArtifacts.push({
                        ...relatedArtifact,
                        detectionReason: 'Dependency relationship'
                    });
                }
            });
        });
        
        // Combine detected and related artifacts
        const allAffectedArtifacts = [...detectedArtifacts, ...relatedArtifacts];
        
        // Remove duplicates
        const uniqueArtifacts = allAffectedArtifacts.filter((artifact, index, self) => 
            index === self.findIndex(a => a.id === artifact.id)
        );
        
        return uniqueArtifacts;
    }

    // Analyze impact of change request
    analyzeImpact(changeRequest) {
        // Auto-detect affected artifacts
        const affectedArtifacts = this.autoDetectAffectedArtifacts(changeRequest);
        const dependencyGraph = this.generateDependencyView(affectedArtifacts.map(a => a.id));
        
        // Calculate impact metrics
        const impactAnalysis = {
            totalArtifacts: affectedArtifacts.length,
            artifactsByType: this.groupArtifactsByType(affectedArtifacts),
            dependencyCount: dependencyGraph.edges.length,
            highImpactArtifacts: this.identifyHighImpactArtifacts(dependencyGraph),
            riskAssessment: this.assessRisk(affectedArtifacts, dependencyGraph),
            detectedArtifacts: affectedArtifacts,
            technicalEffect: this.estimateTechnicalEffect(affectedArtifacts, dependencyGraph),
            costEstimation: this.estimateCost(affectedArtifacts, dependencyGraph),
            effortEstimation: this.estimateEffort(affectedArtifacts, dependencyGraph),
            riskEvaluation: this.evaluateRisk(affectedArtifacts, dependencyGraph, changeRequest)
        };
        
        return impactAnalysis;
    }

    // Estimate technical effect
    estimateTechnicalEffect(artifacts, dependencyGraph) {
        let complexityScore = 0;
        let affectedSystems = [];
        
        // Calculate complexity based on artifact types and dependencies
        artifacts.forEach(artifact => {
            switch (artifact.type) {
                case 'requirement':
                    complexityScore += 2;
                    affectedSystems.push('Business Logic');
                    break;
                case 'design_module':
                    complexityScore += 3;
                    affectedSystems.push('System Architecture');
                    break;
                case 'source_code':
                    complexityScore += 4;
                    affectedSystems.push('Implementation');
                    break;
                case 'test_case':
                    complexityScore += 2;
                    affectedSystems.push('Quality Assurance');
                    break;
                case 'documentation':
                    complexityScore += 1;
                    affectedSystems.push('Documentation');
                    break;
            }
        });
        
        // Add dependency complexity
        complexityScore += dependencyGraph.edges.length * 0.5;
        
        // Determine effect level
        let effectLevel = 'Low';
        if (complexityScore > 15) {
            effectLevel = 'High';
        } else if (complexityScore > 8) {
            effectLevel = 'Medium';
        }
        
        return {
            level: effectLevel,
            score: Math.round(complexityScore),
            affectedSystems: [...new Set(affectedSystems)], // Remove duplicates
            description: `Technical complexity score: ${Math.round(complexityScore)} affecting ${affectedSystems.length} system areas`
        };
    }

    // Estimate cost
    estimateCost(artifacts, dependencyGraph) {
        // Base cost per artifact type (in hours)
        const baseCosts = {
            'requirement': 8,
            'design_module': 16,
            'source_code': 24,
            'test_case': 12,
            'documentation': 6
        };
        
        let totalHours = 0;
        artifacts.forEach(artifact => {
            totalHours += baseCosts[artifact.type] || 10;
        });
        
        // Add dependency overhead
        const dependencyOverhead = dependencyGraph.edges.length * 2;
        totalHours += dependencyOverhead;
        
        // Hourly rate (can be configured)
        const hourlyRate = 50; // $50 per hour
        const totalCost = totalHours * hourlyRate;
        
        return {
            estimatedHours: Math.round(totalHours),
            hourlyRate: hourlyRate,
            totalCost: Math.round(totalCost),
            breakdown: artifacts.map(artifact => ({
                artifact: artifact.name,
                type: artifact.type,
                hours: baseCosts[artifact.type] || 10,
                cost: (baseCosts[artifact.type] || 10) * hourlyRate
            }))
        };
    }

    // Estimate effort
    estimateEffort(artifacts, dependencyGraph) {
        // Effort in person-days
        const effortPerArtifact = {
            'requirement': 1,
            'design_module': 2,
            'source_code': 3,
            'test_case': 1.5,
            'documentation': 0.75
        };
        
        let totalEffort = 0;
        artifacts.forEach(artifact => {
            totalEffort += effortPerArtifact[artifact.type] || 1.5;
        });
        
        // Add coordination effort for dependencies
        const coordinationEffort = dependencyGraph.edges.length * 0.25;
        totalEffort += coordinationEffort;
        
        // Team size estimation
        const teamSize = Math.max(2, Math.min(5, Math.ceil(artifacts.length / 2)));
        
        // Duration in days
        const duration = Math.ceil(totalEffort / teamSize);
        
        return {
            totalPersonDays: Math.round(totalEffort * 8), // Convert to hours
            estimatedDays: duration,
            recommendedTeamSize: teamSize,
            breakdown: artifacts.map(artifact => ({
                artifact: artifact.name,
                type: artifact.type,
                personDays: effortPerArtifact[artifact.type] || 1.5
            }))
        };
    }

    // Evaluate risk
    evaluateRisk(artifacts, dependencyGraph, changeRequest) {
        let riskFactors = [];
        let riskScore = 0;
        
        // Risk factors based on artifact types
        artifacts.forEach(artifact => {
            if (artifact.type === 'design_module') {
                riskScore += 2;
                riskFactors.push('Design module changes may affect system architecture');
            }
            if (artifact.type === 'source_code') {
                riskScore += 3;
                riskFactors.push('Source code changes may introduce bugs');
            }
            if (artifact.status === 'draft') {
                riskScore += 1;
                riskFactors.push('Changes to draft artifacts may be unstable');
            }
        });
        
        // Risk factors based on dependencies
        if (dependencyGraph.edges.length > 5) {
            riskScore += 2;
            riskFactors.push('High dependency complexity increases integration risk');
        }
        
        // Risk factors based on change request
        if (changeRequest.priority === 'high') {
            riskScore += 1;
            riskFactors.push('High priority changes may have tight deadlines');
        }
        
        // Determine risk level
        let riskLevel = 'Low';
        if (riskScore > 8) {
            riskLevel = 'High';
        } else if (riskScore > 4) {
            riskLevel = 'Medium';
        }
        
        return {
            level: riskLevel,
            score: riskScore,
            factors: riskFactors,
            mitigation: this.getMitigationStrategies(riskLevel, riskFactors)
        };
    }

    // Get mitigation strategies
    getMitigationStrategies(riskLevel, riskFactors) {
        const strategies = {
            'Low': [
                'Standard testing procedures',
                'Code review process',
                'Documentation updates'
            ],
            'Medium': [
                'Enhanced testing coverage',
                'Incremental deployment',
                'Stakeholder communication',
                'Rollback planning'
            ],
            'High': [
                'Comprehensive risk assessment',
                'Phased implementation approach',
                'Extensive testing and validation',
                'Contingency planning',
                'Regular stakeholder updates',
                'Performance monitoring'
            ]
        };
        
        return strategies[riskLevel] || strategies['Low'];
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

    // Identify high impact artifacts
    identifyHighImpactArtifacts(dependencyGraph) {
        const nodeConnections = {};
        
        // Count connections for each node
        dependencyGraph.edges.forEach(edge => {
            if (!nodeConnections[edge.source]) {
                nodeConnections[edge.source] = 0;
            }
            if (!nodeConnections[edge.target]) {
                nodeConnections[edge.target] = 0;
            }
            nodeConnections[edge.source]++;
            nodeConnections[edge.target]++;
        });
        
        // Identify high impact nodes (more than 2 connections)
        const highImpactNodes = Object.keys(nodeConnections)
            .filter(nodeId => nodeConnections[nodeId] > 2)
            .map(nodeId => {
                const node = dependencyGraph.nodes.find(n => n.id === nodeId);
                return {
                    ...node,
                    connectionCount: nodeConnections[nodeId]
                };
            });
        
        return highImpactNodes;
    }

    // Assess risk level
    assessRisk(artifacts, dependencyGraph) {
        let riskScore = 0;
        let riskFactors = [];
        
        // Factor 1: Number of artifacts affected
        if (artifacts.length > 5) {
            riskScore += 2;
            riskFactors.push('High number of affected artifacts');
        } else if (artifacts.length > 3) {
            riskScore += 1;
            riskFactors.push('Moderate number of affected artifacts');
        }
        
        // Factor 2: Dependency complexity
        if (dependencyGraph.edges.length > 10) {
            riskScore += 2;
            riskFactors.push('Complex dependency network');
        } else if (dependencyGraph.edges.length > 5) {
            riskScore += 1;
            riskFactors.push('Moderate dependency complexity');
        }
        
        // Factor 3: Critical artifact types
        const criticalTypes = ['requirement', 'design_module'];
        const criticalArtifacts = artifacts.filter(a => criticalTypes.includes(a.type));
        if (criticalArtifacts.length > 0) {
            riskScore += criticalArtifacts.length;
            riskFactors.push(`${criticalArtifacts.length} critical artifacts affected`);
        }
        
        // Determine risk level
        let riskLevel = 'low';
        if (riskScore >= 5) {
            riskLevel = 'high';
        } else if (riskScore >= 3) {
            riskLevel = 'medium';
        }
        
        return {
            level: riskLevel,
            score: riskScore,
            factors: riskFactors
        };
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
