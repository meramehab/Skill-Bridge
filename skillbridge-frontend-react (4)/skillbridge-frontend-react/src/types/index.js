/**
 * @file types/index.js
 * @description Centralized JSDoc Type Definitions for SkillBridge Platform Entities.
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} name - Full user name
 * @property {string} email - University or primary email
 * @property {string} university - University name (e.g., Cairo University)
 * @property {string} faculty - Faculty/Department (e.g., Faculty of Engineering)
 * @property {string} [avatar] - Profile picture URL
 * @property {string} [bio] - Short student bio
 * @property {number} careerReadinessScore - Score between 0 and 100
 * @property {"Beginner"|"Intermediate"|"Professional"} freelancingLevel - Student freelancing level
 * @property {string[]} verifiedSkills - List of verified skill names
 * @property {boolean} isFreelancingUnlocked - Whether user can apply to marketplace projects (score >= 70)
 * @property {boolean} isVerifiedStudent - Whether national/university ID was confirmed
 * @property {number} reputationScore - Total reputation points
 * @property {number} completedProjectsCount - Number of finished projects
 * @property {string} [squadId] - Joined squad ID if any
 */

/**
 * @typedef {Object} Project
 * @property {string} id - Unique project ID
 * @property {string} title - Project title
 * @property {string} description - Comprehensive project requirements
 * @property {number} budget - Budget in EGP or USD
 * @property {string[]} requiredSkills - Required tech/soft skills
 * @property {"micro_gig"|"project"} type - Gig category
 * @property {"open"|"in_progress"|"completed"|"closed"} status - Project status
 * @property {string} clientName - Client or organization name
 * @property {number} clientRating - Client rating from 1 to 5
 * @property {number} proposalsCount - Total proposals submitted
 * @property {string} createdAt - ISO date string
 * @property {string} deadline - Project deadline date
 * @property {number} [matchPercentage] - Calculated AI skill compatibility percentage (0 - 100)
 */

/**
 * @typedef {Object} Proposal
 * @property {string} [id] - Proposal ID
 * @property {string} projectId - Target project ID
 * @property {string} studentId - Submitter student ID
 * @property {string} coverLetter - Proposal narrative
 * @property {number} bidAmount - Proposed budget
 * @property {number} estimatedDays - Estimated delivery duration in days
 * @property {"pending"|"accepted"|"rejected"} status - Status of proposal
 * @property {string} [createdAt] - Submission timestamp
 */

/**
 * @typedef {Object} Post
 * @property {string} id - Post ID
 * @property {Object} author - Post author details
 * @property {string} author.id
 * @property {string} author.name
 * @property {string} author.university
 * @property {string} [author.avatar]
 * @property {string} content - Post text content
 * @property {string} [codeSnippet] - Optional shared code snippet
 * @property {string} [mediaUrl] - Optional image URL
 * @property {number} likesCount - Number of likes
 * @property {number} commentsCount - Number of comments
 * @property {boolean} isLikedByMe - Has current user liked this post
 * @property {string} createdAt - Post creation date
 */

/**
 * @typedef {Object} Comment
 * @property {string} id - Comment ID
 * @property {string} postId - Associated post ID
 * @property {Object} author - Comment author
 * @property {string} content - Comment text
 * @property {string} createdAt - Timestamp
 */

/**
 * @typedef {Object} Squad
 * @property {string} id - Squad ID
 * @property {string} name - Squad display name
 * @property {string} description - Squad focus or mission
 * @property {string} leaderId - Squad creator ID
 * @property {User[]} members - Current members list
 * @property {number} maxMembers - Maximum member capacity (e.g., 5)
 * @property {string[]} neededSkills - Skills the squad is looking for
 * @property {boolean} isVerified - Verified squad badge
 * @property {number} totalCompletedProjects - Finished squad gigs
 * @property {number} squadScore - Aggregated squad XP
 * @property {boolean} isOpenForJoin - Whether applications are open
 */

/**
 * @typedef {Object} SquadJoinRequest
 * @property {string} id - Request ID
 * @property {string} squadId - Squad ID
 * @property {User} student - Submitting student
 * @property {string} message - Application message
 * @property {"pending"|"accepted"|"rejected"} status
 * @property {string} createdAt - Timestamp
 */

/**
 * @typedef {Object} LeaderboardEntry
 * @property {number} rank - Current position rank
 * @property {string} id - Student/University/Squad ID
 * @property {string} name - Display name
 * @property {string} [university] - Student university
 * @property {string} [badge] - Level or verification badge
 * @property {number} xp - Experience Points
 * @property {number} completedTasks - Total tasks completed
 * @property {"up"|"down"|"same"} rankTrend - Trend change direction
 */

/**
 * @typedef {Object} LearningStep
 * @property {string} id - Step ID
 * @property {string} title - Step or skill title
 * @property {string} description - Step overview
 * @property {string} resourceUrl - External resource link (YouTube, Udemy, Article)
 * @property {"not_started"|"in_progress"|"completed"} status - Completion status
 * @property {number} estimatedMinutes - Estimated learning duration
 * @property {boolean} hasAssessment - Whether finishing triggers a skill quiz
 */

/**
 * @typedef {Object} LearningPath
 * @property {string} id - Path ID
 * @property {string} title - Specialization track title
 * @property {string} targetRole - Goal career role (e.g., Frontend React Developer)
 * @property {number} overallProgress - Completion percentage (0 - 100)
 * @property {LearningStep[]} steps - Ordered learning modules
 */

/**
 * @typedef {Object} StudentIdOCRResult
 * @property {boolean} success - OCR extraction status
 * @property {string} extractedName - Extracted full name
 * @property {string} extractedUniversity - Extracted university name
 * @property {string} extractedFaculty - Extracted faculty
 * @property {string} studentIdNumber - University student ID number
 * @property {number} confidenceScore - OCR confidence (0 - 1)
 */

export {};
