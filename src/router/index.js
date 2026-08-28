import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Marketplace from '../views/Marketplace.vue'
import Learning from '../views/Learning.vue'
import Community from '../views/Community.vue'
import Leaderboard from '../views/Leaderboard.vue'
import Profile from '../views/Profile.vue'
import Squad from '../views/Squad.vue'
import ProjectDetails from '../views/ProjectDetails.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import SkillVerification from '../views/SkillVerification.vue'
import CVAnalysis from '../views/CVAnalysis.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/marketplace', name: 'Marketplace', component: Marketplace },
  { path: '/learning', name: 'Learning', component: Learning },
  { path: '/community', name: 'Community', component: Community },
  { path: '/leaderboard', name: 'Leaderboard', component: Leaderboard },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/squad', name: 'Squad', component: Squad },
  { path: '/project/:id', name: 'ProjectDetails', component: ProjectDetails },
  { path: '/student', name: 'StudentDashboard', component: StudentDashboard },
  { path: '/admin', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/skill-verification', name: 'SkillVerification', component: SkillVerification },
  { path: '/cv-analysis', name: 'CVAnalysis', component: CVAnalysis },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router