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
        if (!localStorage.getItem('cias_historical_changes')) {
            this.createHistoricalChangeData();
        }
        if (!localStorage.getItem('cias_team_resources')) {
            this.createTeamResourceData();
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
                description: 'Requirements for user login and authentication system including OAuth integration, password policies, and session management',
                version: '1.0',
                status: 'approved',
                createdBy: 'admin',
                createdAt: '2026-04-01T10:00:00Z',
                updatedAt: '2026-04-01T10:00:00Z',
                priority: 'high',
                businessImpact: 'critical'
            },
            {
                id: 'REQ-002',
                name: 'Data Security Requirements',
                type: 'requirement',
                description: 'Security requirements for data protection and encryption including GDPR compliance, data masking, and audit logging',
                version: '1.2',
                status: 'approved',
                createdBy: 'admin',
                createdAt: '2026-04-02T11:00:00Z',
                updatedAt: '2026-04-05T14:30:00Z',
                priority: 'high',
                businessImpact: 'critical'
            },
            {
                id: 'REQ-003',
                name: 'Performance Requirements',
                type: 'requirement',
                description: 'System performance and response time requirements including API response times, database query optimization, and caching strategies',
                version: '1.0',
                status: 'draft',
                createdBy: 'project_manager',
                createdAt: '2026-04-10T09:00:00Z',
                updatedAt: '2026-04-10T09:00:00Z',
                priority: 'medium',
                businessImpact: 'high'
            },
            {
                id: 'REQ-004',
                name: 'Payment Processing Requirements',
                type: 'requirement',
                description: 'Payment gateway integration requirements including PCI compliance, multiple payment methods, and transaction security',
                version: '2.1',
                status: 'approved',
                createdBy: 'product_owner',
                createdAt: '2026-03-15T14:00:00Z',
                updatedAt: '2026-04-20T09:30:00Z',
                priority: 'high',
                businessImpact: 'critical'
            },
            {
                id: 'REQ-005',
                name: 'Mobile App Requirements',
                type: 'requirement',
                description: 'Mobile application requirements including responsive design, offline functionality, and push notifications',
                version: '1.0',
                status: 'approved',
                createdBy: 'product_owner',
                createdAt: '2026-04-05T16:00:00Z',
                updatedAt: '2026-04-18T11:00:00Z',
                priority: 'medium',
                businessImpact: 'high'
            },
            {
                id: 'REQ-006',
                name: 'Reporting Dashboard Requirements',
                type: 'requirement',
                description: 'Business intelligence dashboard requirements including real-time analytics, data visualization, and export capabilities',
                version: '1.3',
                status: 'approved',
                createdBy: 'business_analyst',
                createdAt: '2026-04-12T10:00:00Z',
                updatedAt: '2026-04-22T13:45:00Z',
                priority: 'medium',
                businessImpact: 'medium'
            },

            // Design Modules
            {
                id: 'DES-001',
                name: 'Authentication Module Design',
                type: 'design_module',
                description: 'UML diagrams and architecture for authentication system including token management, password hashing, and multi-factor authentication',
                version: '2.1',
                status: 'approved',
                createdBy: 'designer',
                createdAt: '2026-04-03T10:00:00Z',
                updatedAt: '2026-04-08T16:00:00Z',
                complexity: 'high',
                estimatedHours: 40
            },
            {
                id: 'DES-002',
                name: 'Database Schema Design',
                type: 'design_module',
                description: 'Database schema and entity relationship diagrams including normalization, indexing strategies, and data migration plans',
                version: '1.5',
                status: 'approved',
                createdBy: 'designer',
                createdAt: '2026-04-04T13:00:00Z',
                updatedAt: '2026-04-12T10:00:00Z',
                complexity: 'medium',
                estimatedHours: 32
            },
            {
                id: 'DES-003',
                name: 'API Interface Design',
                type: 'design_module',
                description: 'RESTful API design and documentation including OpenAPI specifications, rate limiting, and versioning strategy',
                version: '1.0',
                status: 'draft',
                createdBy: 'developer',
                createdAt: '2026-04-11T15:00:00Z',
                updatedAt: '2026-04-11T15:00:00Z',
                complexity: 'medium',
                estimatedHours: 24
            },
            {
                id: 'DES-004',
                name: 'Payment Gateway Integration Design',
                type: 'design_module',
                description: 'Payment service integration architecture including webhook handling, error recovery, and transaction reconciliation',
                version: '3.0',
                status: 'approved',
                createdBy: 'solution_architect',
                createdAt: '2026-03-20T09:00:00Z',
                updatedAt: '2026-04-15T14:20:00Z',
                complexity: 'high',
                estimatedHours: 56
            },
            {
                id: 'DES-005',
                name: 'Mobile UI/UX Design',
                type: 'design_module',
                description: 'Mobile application user interface design including wireframes, mockups, and interaction patterns',
                version: '2.2',
                status: 'approved',
                createdBy: 'ui_designer',
                createdAt: '2026-04-06T11:00:00Z',
                updatedAt: '2026-04-19T16:30:00Z',
                complexity: 'medium',
                estimatedHours: 36
            },

            // Source Code Files
            {
                id: 'SRC-001',
                name: 'AuthService.js',
                type: 'source_code',
                description: 'JavaScript authentication service implementation including JWT handling, password validation, and session management',
                version: '3.2',
                status: 'approved',
                createdBy: 'senior_developer',
                createdAt: '2026-04-05T09:00:00Z',
                updatedAt: '2026-04-15T11:00:00Z',
                linesOfCode: 850,
                complexity: 'high',
                testCoverage: 85
            },
            {
                id: 'SRC-002',
                name: 'UserController.js',
                type: 'source_code',
                description: 'User management controller class including CRUD operations, validation, and business logic',
                version: '2.1',
                status: 'approved',
                createdBy: 'developer',
                createdAt: '2026-04-06T10:00:00Z',
                updatedAt: '2026-04-14T14:00:00Z',
                linesOfCode: 420,
                complexity: 'medium',
                testCoverage: 72
            },
            {
                id: 'SRC-003',
                name: 'DatabaseManager.js',
                type: 'source_code',
                description: 'Database connection and query management including connection pooling, transaction handling, and query optimization',
                version: '1.8',
                status: 'approved',
                createdBy: 'developer',
                createdAt: '2026-04-07T11:00:00Z',
                updatedAt: '2026-04-13T09:00:00Z',
                linesOfCode: 680,
                complexity: 'medium',
                testCoverage: 68
            },
            {
                id: 'SRC-004',
                name: 'SecurityUtils.js',
                type: 'source_code',
                description: 'Security utility functions and encryption including data masking, hash algorithms, and security validations',
                version: '1.0',
                status: 'draft',
                createdBy: 'security_developer',
                createdAt: '2026-04-12T16:00:00Z',
                updatedAt: '2026-04-12T16:00:00Z',
                linesOfCode: 320,
                complexity: 'high',
                testCoverage: 90
            },
            {
                id: 'SRC-005',
                name: 'PaymentService.js',
                type: 'source_code',
                description: 'Payment processing service including gateway integration, transaction management, and error handling',
                version: '4.1',
                status: 'approved',
                createdBy: 'senior_developer',
                createdAt: '2026-03-25T13:00:00Z',
                updatedAt: '2026-04-16T10:15:00Z',
                linesOfCode: 1200,
                complexity: 'high',
                testCoverage: 88
            },
            {
                id: 'SRC-006',
                name: 'AnalyticsEngine.js',
                type: 'source_code',
                description: 'Business analytics engine including data aggregation, report generation, and metric calculations',
                version: '1.5',
                status: 'approved',
                createdBy: 'data_developer',
                createdAt: '2026-04-14T09:00:00Z',
                updatedAt: '2026-04-21T15:45:00Z',
                linesOfCode: 950,
                complexity: 'high',
                testCoverage: 76
            },
            {
                id: 'SRC-007',
                name: 'MobileAppController.js',
                type: 'source_code',
                description: 'Mobile application controller including API endpoints, data synchronization, and offline support',
                version: '2.0',
                status: 'approved',
                createdBy: 'mobile_developer',
                createdAt: '2026-04-08T14:00:00Z',
                updatedAt: '2026-04-18T12:30:00Z',
                linesOfCode: 780,
                complexity: 'medium',
                testCoverage: 70
            },

            // Test Cases
            {
                id: 'TEST-001',
                name: 'Login Functionality Tests',
                type: 'test_case',
                description: 'Unit tests for login authentication including positive and negative test cases, edge cases, and performance tests',
                version: '2.0',
                status: 'approved',
                createdBy: 'tester',
                createdAt: '2026-04-08T08:00:00Z',
                updatedAt: '2026-04-16T10:00:00Z',
                testCount: 45,
                passRate: 95,
                automationLevel: 'full'
            },
            {
                id: 'TEST-002',
                name: 'Security Tests',
                type: 'test_case',
                description: 'Security vulnerability and penetration tests including OWASP top 10, authentication bypass, and data exposure tests',
                version: '1.1',
                status: 'approved',
                createdBy: 'security_tester',
                createdAt: '2026-04-09T10:00:00Z',
                updatedAt: '2026-04-17T14:00:00Z',
                testCount: 32,
                passRate: 98,
                automationLevel: 'full'
            },
            {
                id: 'TEST-003',
                name: 'Performance Tests',
                type: 'test_case',
                description: 'Load testing and performance benchmarks including stress tests, scalability tests, and response time validation',
                version: '1.0',
                status: 'draft',
                createdBy: 'performance_tester',
                createdAt: '2026-04-13T12:00:00Z',
                updatedAt: '2026-04-13T12:00:00Z',
                testCount: 18,
                passRate: 88,
                automationLevel: 'partial'
            },
            {
                id: 'TEST-004',
                name: 'Payment Processing Tests',
                type: 'test_case',
                description: 'Payment gateway integration tests including transaction validation, error handling, and reconciliation tests',
                version: '3.2',
                status: 'approved',
                createdBy: 'tester',
                createdAt: '2026-03-28T11:00:00Z',
                updatedAt: '2026-04-19T09:15:00Z',
                testCount: 67,
                passRate: 97,
                automationLevel: 'full'
            },
            {
                id: 'TEST-005',
                name: 'Mobile App Tests',
                type: 'test_case',
                description: 'Mobile application tests including UI tests, device compatibility, and offline functionality tests',
                version: '1.8',
                status: 'approved',
                createdBy: 'mobile_tester',
                createdAt: '2026-04-10T15:00:00Z',
                updatedAt: '2026-04-20T13:20:00Z',
                testCount: 54,
                passRate: 92,
                automationLevel: 'partial'
            },

            // Documentation
            {
                id: 'DOC-001',
                name: 'User Manual',
                type: 'documentation',
                description: 'End-user documentation and user guide including step-by-step instructions, screenshots, and troubleshooting',
                version: '1.3',
                status: 'approved',
                createdBy: 'technical_writer',
                createdAt: '2026-04-10T14:00:00Z',
                updatedAt: '2026-04-18T09:00:00Z',
                pageCount: 45,
                lastReviewed: '2026-04-18'
            },
            {
                id: 'DOC-002',
                name: 'API Documentation',
                type: 'documentation',
                description: 'Technical API reference documentation including endpoint specifications, request/response examples, and authentication',
                version: '2.0',
                status: 'approved',
                createdBy: 'developer',
                createdAt: '2026-04-11T11:00:00Z',
                updatedAt: '2026-04-19T15:00:00Z',
                pageCount: 120,
                lastReviewed: '2026-04-19'
            },
            {
                id: 'DOC-003',
                name: 'Installation Guide',
                type: 'documentation',
                description: 'System installation and setup documentation including prerequisites, configuration steps, and troubleshooting',
                version: '1.0',
                status: 'draft',
                createdBy: 'technical_writer',
                createdAt: '2026-04-14T13:00:00Z',
                updatedAt: '2026-04-14T13:00:00Z',
                pageCount: 28,
                lastReviewed: '2026-04-14'
            },
            {
                id: 'DOC-004',
                name: 'Security Policy Documentation',
                type: 'documentation',
                description: 'Security policies and procedures including access control, data handling, and incident response protocols',
                version: '2.1',
                status: 'approved',
                createdBy: 'security_officer',
                createdAt: '2026-04-02T16:00:00Z',
                updatedAt: '2026-04-17T11:30:00Z',
                pageCount: 85,
                lastReviewed: '2026-04-17'
            },
            {
                id: 'DOC-005',
                name: 'Payment Integration Guide',
                type: 'documentation',
                description: 'Payment gateway integration guide including setup instructions, testing procedures, and production deployment',
                version: '3.0',
                status: 'approved',
                createdBy: 'integration_specialist',
                createdAt: '2026-03-30T10:00:00Z',
                updatedAt: '2026-04-16T14:45:00Z',
                pageCount: 62,
                lastReviewed: '2026-04-16'
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
                description: 'Authentication module design implements user authentication requirements',
                impact: 'critical'
            },
            {
                id: 'DEP-002',
                sourceArtifactId: 'DES-001',
                targetArtifactId: 'SRC-001',
                type: 'implements',
                strength: 'strong',
                description: 'AuthService implements authentication module design',
                impact: 'critical'
            },
            {
                id: 'DEP-003',
                sourceArtifactId: 'SRC-001',
                targetArtifactId: 'TEST-001',
                type: 'tests',
                strength: 'medium',
                description: 'Login tests validate AuthService functionality',
                impact: 'high'
            },
            {
                id: 'DEP-004',
                sourceArtifactId: 'SRC-001',
                targetArtifactId: 'SRC-004',
                type: 'uses',
                strength: 'medium',
                description: 'AuthService uses SecurityUtils for encryption',
                impact: 'high'
            },

            // Security dependencies
            {
                id: 'DEP-005',
                sourceArtifactId: 'REQ-002',
                targetArtifactId: 'SRC-004',
                type: 'implements',
                strength: 'strong',
                description: 'SecurityUtils implements data security requirements',
                impact: 'critical'
            },
            {
                id: 'DEP-006',
                sourceArtifactId: 'SRC-004',
                targetArtifactId: 'TEST-002',
                type: 'tests',
                strength: 'strong',
                description: 'Security tests validate SecurityUtils functionality',
                impact: 'high'
            },
            {
                id: 'DEP-007',
                sourceArtifactId: 'REQ-002',
                targetArtifactId: 'DOC-004',
                type: 'documents',
                strength: 'medium',
                description: 'Security policy documents data security requirements',
                impact: 'medium'
            },

            // Database dependencies
            {
                id: 'DEP-008',
                sourceArtifactId: 'DES-002',
                targetArtifactId: 'SRC-003',
                type: 'implements',
                strength: 'strong',
                description: 'DatabaseManager implements database schema design',
                impact: 'critical'
            },
            {
                id: 'DEP-009',
                sourceArtifactId: 'SRC-003',
                targetArtifactId: 'SRC-001',
                type: 'uses',
                strength: 'medium',
                description: 'AuthService uses DatabaseManager for user data',
                impact: 'high'
            },
            {
                id: 'DEP-010',
                sourceArtifactId: 'SRC-003',
                targetArtifactId: 'SRC-002',
                type: 'uses',
                strength: 'medium',
                description: 'UserController uses DatabaseManager for data operations',
                impact: 'high'
            },
            {
                id: 'DEP-011',
                sourceArtifactId: 'SRC-003',
                targetArtifactId: 'SRC-006',
                type: 'provides_data_for',
                strength: 'medium',
                description: 'DatabaseManager provides data for AnalyticsEngine',
                impact: 'medium'
            },

            // Payment processing dependencies
            {
                id: 'DEP-012',
                sourceArtifactId: 'REQ-004',
                targetArtifactId: 'DES-004',
                type: 'implements',
                strength: 'strong',
                description: 'Payment gateway design implements payment processing requirements',
                impact: 'critical'
            },
            {
                id: 'DEP-013',
                sourceArtifactId: 'DES-004',
                targetArtifactId: 'SRC-005',
                type: 'implements',
                strength: 'strong',
                description: 'PaymentService implements payment gateway design',
                impact: 'critical'
            },
            {
                id: 'DEP-014',
                sourceArtifactId: 'SRC-005',
                targetArtifactId: 'TEST-004',
                type: 'tests',
                strength: 'strong',
                description: 'Payment tests validate PaymentService functionality',
                impact: 'high'
            },
            {
                id: 'DEP-015',
                sourceArtifactId: 'SRC-005',
                targetArtifactId: 'SRC-003',
                type: 'uses',
                strength: 'medium',
                description: 'PaymentService uses DatabaseManager for transaction storage',
                impact: 'high'
            },
            {
                id: 'DEP-016',
                sourceArtifactId: 'SRC-005',
                targetArtifactId: 'SRC-004',
                type: 'uses',
                strength: 'medium',
                description: 'PaymentService uses SecurityUtils for payment encryption',
                impact: 'high'
            },

            // Mobile app dependencies
            {
                id: 'DEP-017',
                sourceArtifactId: 'REQ-005',
                targetArtifactId: 'DES-005',
                type: 'implements',
                strength: 'medium',
                description: 'Mobile UI/UX design implements mobile app requirements',
                impact: 'high'
            },
            {
                id: 'DEP-018',
                sourceArtifactId: 'DES-005',
                targetArtifactId: 'SRC-007',
                type: 'implements',
                strength: 'medium',
                description: 'MobileAppController implements mobile UI/UX design',
                impact: 'high'
            },
            {
                id: 'DEP-019',
                sourceArtifactId: 'SRC-007',
                targetArtifactId: 'TEST-005',
                type: 'tests',
                strength: 'medium',
                description: 'Mobile app tests validate MobileAppController functionality',
                impact: 'medium'
            },
            {
                id: 'DEP-020',
                sourceArtifactId: 'SRC-007',
                targetArtifactId: 'SRC-001',
                type: 'uses',
                strength: 'medium',
                description: 'MobileAppController uses AuthService for mobile authentication',
                impact: 'high'
            },
            {
                id: 'DEP-021',
                sourceArtifactId: 'SRC-007',
                targetArtifactId: 'SRC-003',
                type: 'uses',
                strength: 'medium',
                description: 'MobileAppController uses DatabaseManager for data synchronization',
                impact: 'medium'
            },

            // Analytics and reporting dependencies
            {
                id: 'DEP-022',
                sourceArtifactId: 'REQ-006',
                targetArtifactId: 'SRC-006',
                type: 'implements',
                strength: 'medium',
                description: 'AnalyticsEngine implements reporting dashboard requirements',
                impact: 'medium'
            },
            {
                id: 'DEP-023',
                sourceArtifactId: 'SRC-006',
                targetArtifactId: 'TEST-003',
                type: 'tests',
                strength: 'weak',
                description: 'Performance tests validate AnalyticsEngine performance',
                impact: 'low'
            },

            // API dependencies
            {
                id: 'DEP-024',
                sourceArtifactId: 'DES-003',
                targetArtifactId: 'SRC-002',
                type: 'implements',
                strength: 'medium',
                description: 'UserController implements API interface design',
                impact: 'medium'
            },
            {
                id: 'DEP-025',
                sourceArtifactId: 'SRC-002',
                targetArtifactId: 'SRC-001',
                type: 'uses',
                strength: 'medium',
                description: 'UserController uses AuthService for user authentication',
                impact: 'high'
            },

            // Documentation dependencies
            {
                id: 'DEP-026',
                sourceArtifactId: 'SRC-001',
                targetArtifactId: 'DOC-002',
                type: 'documents',
                strength: 'weak',
                description: 'API documentation covers AuthService methods',
                impact: 'low'
            },
            {
                id: 'DEP-027',
                sourceArtifactId: 'DES-001',
                targetArtifactId: 'DOC-001',
                type: 'documents',
                strength: 'medium',
                description: 'User manual documents authentication features',
                impact: 'medium'
            },
            {
                id: 'DEP-028',
                sourceArtifactId: 'SRC-005',
                targetArtifactId: 'DOC-005',
                type: 'documents',
                strength: 'medium',
                description: 'Payment integration guide covers PaymentService usage',
                impact: 'medium'
            },
            {
                id: 'DEP-029',
                sourceArtifactId: 'DES-002',
                targetArtifactId: 'DOC-003',
                type: 'documents',
                strength: 'weak',
                description: 'Installation guide covers database setup',
                impact: 'low'
            },

            // Cross-cutting dependencies
            {
                id: 'DEP-030',
                sourceArtifactId: 'REQ-003',
                targetArtifactId: 'TEST-003',
                type: 'validates',
                strength: 'medium',
                description: 'Performance tests validate performance requirements',
                impact: 'medium'
            },
            {
                id: 'DEP-031',
                sourceArtifactId: 'SRC-001',
                targetArtifactId: 'SRC-002',
                type: 'validates',
                strength: 'weak',
                description: 'AuthService validates UserController user operations',
                impact: 'low'
            },
            {
                id: 'DEP-032',
                sourceArtifactId: 'SRC-004',
                targetArtifactId: 'SRC-005',
                type: 'secures',
                strength: 'medium',
                description: 'SecurityUtils secures PaymentService transactions',
                impact: 'high'
            },
            {
                id: 'DEP-033',
                sourceArtifactId: 'SRC-003',
                targetArtifactId: 'TEST-003',
                type: 'tests',
                strength: 'weak',
                description: 'Performance tests include database operations',
                impact: 'low'
            }
        ];

        localStorage.setItem(this.dependenciesStorageKey, JSON.stringify(dummyDependencies));
    }

    // Create mock historical change data
    createHistoricalChangeData() {
        const historicalChanges = [
            {
                id: 'HIST-001',
                changeRequestId: 'CR-20260315-ABC12',
                changeType: 'feature',
                description: 'Add OAuth 2.0 authentication support',
                dateCompleted: '2026-03-20T17:00:00Z',
                actualCost: 8500,
                estimatedCost: 7500,
                actualEffort: 68,
                estimatedEffort: 60,
                affectedArtifacts: ['REQ-001', 'DES-001', 'SRC-001', 'TEST-001'],
                complexity: 'high',
                teamSize: 3,
                issuesEncountered: 2,
                userSatisfaction: 4.2
            },
            {
                id: 'HIST-002',
                changeRequestId: 'CR-20260325-DEF34',
                changeType: 'security',
                description: 'Implement data encryption for sensitive fields',
                dateCompleted: '2026-04-02T14:30:00Z',
                actualCost: 6200,
                estimatedCost: 5500,
                actualEffort: 42,
                estimatedEffort: 40,
                affectedArtifacts: ['REQ-002', 'SRC-004', 'TEST-002', 'DOC-004'],
                complexity: 'medium',
                teamSize: 2,
                issuesEncountered: 1,
                userSatisfaction: 4.5
            },
            {
                id: 'HIST-003',
                changeRequestId: 'CR-20260401-GHI56',
                changeType: 'enhancement',
                description: 'Optimize database queries for better performance',
                dateCompleted: '2026-04-08T16:00:00Z',
                actualCost: 4800,
                estimatedCost: 4000,
                actualEffort: 32,
                estimatedEffort: 30,
                affectedArtifacts: ['SRC-003', 'TEST-003'],
                complexity: 'medium',
                teamSize: 2,
                issuesEncountered: 0,
                userSatisfaction: 4.0
            },
            {
                id: 'HIST-004',
                changeRequestId: 'CR-20260410-JKL78',
                changeType: 'feature',
                description: 'Integrate Stripe payment gateway',
                dateCompleted: '2026-04-18T12:00:00Z',
                actualCost: 12000,
                estimatedCost: 10000,
                actualEffort: 85,
                estimatedEffort: 80,
                affectedArtifacts: ['REQ-004', 'DES-004', 'SRC-005', 'TEST-004', 'DOC-005'],
                complexity: 'high',
                teamSize: 4,
                issuesEncountered: 3,
                userSatisfaction: 4.7
            },
            {
                id: 'HIST-005',
                changeRequestId: 'CR-20260405-MNO90',
                changeType: 'bug_fix',
                description: 'Fix user session timeout issues',
                dateCompleted: '2026-04-12T10:30:00Z',
                actualCost: 2800,
                estimatedCost: 2500,
                actualEffort: 18,
                estimatedEffort: 20,
                affectedArtifacts: ['SRC-001', 'TEST-001'],
                complexity: 'low',
                teamSize: 1,
                issuesEncountered: 0,
                userSatisfaction: 4.3
            }
        ];

        localStorage.setItem('cias_historical_changes', JSON.stringify(historicalChanges));
    }

    // Create mock team and resource data
    createTeamResourceData() {
        const teamData = {
            developers: [
                {
                    id: 'DEV-001',
                    name: 'John Smith',
                    role: 'Senior Developer',
                    skills: ['JavaScript', 'Node.js', 'Security', 'Database'],
                    hourlyRate: 85,
                    experience: 'senior',
                    availability: 0.8,
                    productivity: 1.2
                },
                {
                    id: 'DEV-002',
                    name: 'Sarah Johnson',
                    role: 'Full Stack Developer',
                    skills: ['JavaScript', 'React', 'API Design', 'Testing'],
                    hourlyRate: 75,
                    experience: 'mid',
                    availability: 0.9,
                    productivity: 1.0
                },
                {
                    id: 'DEV-003',
                    name: 'Mike Chen',
                    role: 'Backend Developer',
                    skills: ['Database', 'API', 'Performance', 'Security'],
                    hourlyRate: 70,
                    experience: 'mid',
                    availability: 0.85,
                    productivity: 0.95
                },
                {
                    id: 'DEV-004',
                    name: 'Emily Davis',
                    role: 'Mobile Developer',
                    skills: ['React Native', 'Mobile UI', 'API Integration'],
                    hourlyRate: 80,
                    experience: 'mid',
                    availability: 0.75,
                    productivity: 1.1
                },
                {
                    id: 'DEV-005',
                    name: 'Alex Wilson',
                    role: 'Security Developer',
                    skills: ['Security', 'Encryption', 'Compliance', 'Testing'],
                    hourlyRate: 90,
                    experience: 'senior',
                    availability: 0.7,
                    productivity: 1.15
                }
            ],
            testers: [
                {
                    id: 'TEST-001',
                    name: 'Lisa Anderson',
                    role: 'QA Engineer',
                    skills: ['Unit Testing', 'Integration Testing', 'Security Testing'],
                    hourlyRate: 65,
                    experience: 'mid',
                    availability: 0.9,
                    productivity: 1.0
                },
                {
                    id: 'TEST-002',
                    name: 'Robert Taylor',
                    role: 'Performance Tester',
                    skills: ['Load Testing', 'Performance Analysis', 'Monitoring'],
                    hourlyRate: 70,
                    experience: 'senior',
                    availability: 0.8,
                    productivity: 1.1
                },
                {
                    id: 'TEST-003',
                    name: 'Maria Garcia',
                    role: 'Mobile Tester',
                    skills: ['Mobile Testing', 'UI Testing', 'Device Compatibility'],
                    hourlyRate: 60,
                    experience: 'mid',
                    availability: 0.85,
                    productivity: 0.95
                }
            ],
            designers: [
                {
                    id: 'DES-001',
                    name: 'David Brown',
                    role: 'UI/UX Designer',
                    skills: ['UI Design', 'UX Research', 'Prototyping'],
                    hourlyRate: 70,
                    experience: 'senior',
                    availability: 0.8,
                    productivity: 1.1
                },
                {
                    id: 'DES-002',
                    name: 'Jennifer Lee',
                    role: 'System Architect',
                    skills: ['System Design', 'Architecture', 'Integration'],
                    hourlyRate: 95,
                    experience: 'senior',
                    availability: 0.7,
                    productivity: 1.2
                }
            ],
            overheadRates: {
                management: 0.15,
                infrastructure: 0.10,
                tools: 0.05,
                contingency: 0.20
            }
        };

        localStorage.setItem('cias_team_resources', JSON.stringify(teamData));
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
        
        // Enhanced keywords for artifact type detection
        const keywordMappings = {
            'requirement': ['requirement', 'spec', 'specification', 'functional', 'user story', 'auth', 'security', 'payment', 'mobile', 'performance', 'reporting'],
            'design_module': ['design', 'architecture', 'module', 'component', 'interface', 'ui', 'ux', 'api', 'database', 'schema'],
            'source_code': ['code', 'function', 'class', 'method', 'algorithm', 'implementation', 'service', 'controller', 'manager', 'utils', 'auth', 'payment', 'mobile', 'analytics'],
            'test_case': ['test', 'testing', 'unit test', 'integration', 'validation', 'performance', 'security', 'mobile', 'payment'],
            'documentation': ['documentation', 'manual', 'guide', 'readme', 'help', 'api', 'installation', 'security', 'payment', 'integration']
        };
        
        // Analyze change request description and type
        const searchText = `${changeRequest.changeType} ${changeRequest.description}`.toLowerCase();
        const detectedArtifacts = [];
        
        console.log('Analyzing change request:', searchText);
        console.log('Available artifacts:', allArtifacts.length);
        
        // Enhanced keyword-based detection
        allArtifacts.forEach(artifact => {
            const artifactKeywords = keywordMappings[artifact.type] || [];
            const artifactText = `${artifact.name} ${artifact.description}`.toLowerCase();
            
            // Check if change request mentions artifact keywords (more flexible matching)
            const hasKeywordMatch = artifactKeywords.some(keyword => {
                return searchText.includes(keyword) || artifactText.includes(keyword);
            });
            
            // Check if change request mentions artifact directly
            const hasDirectMatch = searchText.includes(artifact.name.toLowerCase()) ||
                                  artifact.name.toLowerCase().includes(searchText) ||
                                  artifactText.includes(searchText);
            
            // Check for partial matches in artifact names
            const hasPartialMatch = artifact.name.toLowerCase().split(' ').some(word => 
                word.length > 3 && searchText.includes(word)
            );
            
            if (hasKeywordMatch || hasDirectMatch || hasPartialMatch) {
                let reason = 'Keyword match';
                if (hasDirectMatch) reason = 'Direct mention';
                else if (hasPartialMatch) reason = 'Partial match';
                
                detectedArtifacts.push({
                    ...artifact,
                    detectionReason: reason
                });
                console.log(`Detected artifact: ${artifact.name} (${reason})`);
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
        
        // Fallback: if no artifacts detected, return some default ones based on change type
        if (uniqueArtifacts.length === 0) {
            console.log('No artifacts detected, using fallback detection');
            const fallbackArtifacts = this.getFallbackArtifacts(changeRequest);
            console.log('Fallback artifacts detected:', fallbackArtifacts.length);
            return fallbackArtifacts;
        }
        
        console.log('Final detected artifacts:', uniqueArtifacts.length);
        return uniqueArtifacts;
    }

    // Fallback artifact detection based on change type
    getFallbackArtifacts(changeRequest) {
        const allArtifacts = this.getArtifacts();
        const changeType = changeRequest.changeType.toLowerCase();
        
        let fallbackIds = [];
        
        switch (changeType) {
            case 'security':
                fallbackIds = ['REQ-001', 'REQ-002', 'SRC-001', 'SRC-004', 'TEST-002', 'DOC-004'];
                break;
            case 'feature':
                fallbackIds = ['REQ-004', 'DES-004', 'SRC-005', 'TEST-004', 'DOC-005'];
                break;
            case 'performance':
                fallbackIds = ['REQ-003', 'SRC-003', 'TEST-003'];
                break;
            case 'bug_fix':
                fallbackIds = ['SRC-001', 'SRC-002', 'TEST-001'];
                break;
            case 'enhancement':
                fallbackIds = ['REQ-005', 'DES-005', 'SRC-007', 'TEST-005'];
                break;
            case 'documentation':
                fallbackIds = ['DOC-001', 'DOC-002', 'DOC-003'];
                break;
            default:
                fallbackIds = ['REQ-001', 'DES-001', 'SRC-001', 'TEST-001'];
        }
        
        const fallbackArtifacts = allArtifacts.filter(artifact => 
            fallbackIds.includes(artifact.id)
        ).map(artifact => ({
            ...artifact,
            detectionReason: 'Fallback detection'
        }));
        
        return fallbackArtifacts;
    }

    // Analyze impact of change request
    analyzeImpact(changeRequest) {
        console.log('=== Starting Impact Analysis ===');
        console.log('Change Request:', changeRequest);
        
        // Auto-detect affected artifacts
        const affectedArtifacts = this.autoDetectAffectedArtifacts(changeRequest);
        console.log('Affected Artifacts Found:', affectedArtifacts.length);
        
        const dependencyGraph = this.generateDependencyView(affectedArtifacts.map(a => a.id));
        console.log('Dependency Graph Edges:', dependencyGraph.edges.length);
        
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
        
        console.log('=== Analysis Results ===');
        console.log('Total Artifacts:', impactAnalysis.totalArtifacts);
        console.log('Cost Estimation:', impactAnalysis.costEstimation);
        console.log('Effort Estimation:', impactAnalysis.effortEstimation);
        console.log('Technical Effect:', impactAnalysis.technicalEffect);
        
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
