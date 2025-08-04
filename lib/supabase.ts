import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 디버깅용 로그
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)
console.log('URL starts with https:', supabaseUrl?.startsWith('https://'))

let supabase = null

try {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url_here' && supabaseUrl.startsWith('https://')) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('Supabase client created successfully')
  } else {
    console.log('Supabase client not created - missing or invalid credentials')
  }
} catch (error) {
  console.error('Error creating Supabase client:', error)
  supabase = null
}

export { supabase }

// 타입 정의
export interface Employee {
  id: number
  employee_code: string
  nick_name: string
  full_name: string
  full_name_thai?: string
  department: string
  start_date: string
  end_date?: string
  bank_name: string
  bank_account: string
  monthly_salary: number
  hourly_rate: number
  overtime_rate: number
  social_insurance_rate: number
  tax_rate: number
  performance_rating: number
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED'
  photo_url?: string
  photo_filename?: string
  created_at: string
}

export interface PayrollStatement {
  id: number
  employee_id: number
  pay_year: number
  pay_month: string
  pay_period_start: string
  pay_period_end: string
  payment_date: string
  work_days: number
  actual_work_days: number
  base_salary: number
  hourly_rate: number
  overtime_rate: number
  position_allowance: number
  meal_allowance: number
  transport_allowance: number
  performance_bonus: number
  special_bonus: number
  bonus_reason?: string
  total_overtime_hours: number
  social_insurance: number
  personal_tax: number
  advance_salary: number
  salary_deduction: number
  other_deductions: number
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID'
  created_by: number
  approved_by?: number
  approved_at?: string
  created_at: string
  employees?: Employee
}

export interface OvertimeRecord {
  id: number
  payroll_id: number
  employee_id: number
  overtime_date: string
  start_time: string
  end_time: string
  overtime_hours: number
  work_description: string
  reason: 'PROJECT_DEADLINE' | 'URGENT_TASK' | 'SYSTEM_MAINTENANCE' | 'MEETING' | 'OTHER'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  created_by: number
  approved_by?: number
  approved_at?: string
  rejection_reason?: string
  created_at: string
  employees?: Employee
}

export interface PointRecord {
  id: number
  employee_id: number
  point_date: string
  point_type: 'BONUS' | 'PENALTY'
  point_amount: number
  point_reason: string
  description?: string
  category: 'PERFORMANCE' | 'ATTENDANCE' | 'TEAMWORK' | 'INNOVATION' | 'OTHER'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  created_by?: number
  approved_by?: number
  approved_at?: string
  rejection_reason?: string
  created_at: string
  employees?: Employee
}

export interface EmployeePointSummary {
  employee_id: number
  employee_code: string
  nick_name: string
  full_name: string
  department: string
  total_points: number
  bonus_points: number
  penalty_points: number
  total_records: number
}

export interface AdminUser {
  id: number
  username: string
  password_hash: string
  full_name: string
  email?: string
  role: 'SUPER_ADMIN' | 'HR_ADMIN' | 'FINANCE_ADMIN'
  department?: string
  is_active: boolean
  last_login?: string
  created_at: string
} 