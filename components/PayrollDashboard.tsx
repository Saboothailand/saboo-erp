'use client'

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Check,
  X,
  Calendar,
  Building,
  User,
  LogOut,
  Menu,
  Home,
  FileText,
  Settings,
  Shield,
  Trash2,
  Upload,
  Camera,
  Star,
  Award,
  Minus,
  Layout
} from 'lucide-react';
import { supabase, Employee, PayrollStatement, OvertimeRecord, PointRecord, EmployeePointSummary } from '@/lib/supabase';

const PayrollDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('JULY');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 상태 관리
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollData, setPayrollData] = useState<PayrollStatement[]>([]);
  const [overtimeData, setOvertimeData] = useState<OvertimeRecord[]>([]);
  const [pointData, setPointData] = useState<PointRecord[]>([]);
  const [pointSummary, setPointSummary] = useState<EmployeePointSummary[]>([]);

  // 모달 상태 관리
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showPointModal, setShowPointModal] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<PayrollStatement | null>(null);
  const [editingOvertime, setEditingOvertime] = useState<OvertimeRecord | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingPoint, setEditingPoint] = useState<PointRecord | null>(null);

  // 새 데이터 상태
  const [newPayroll, setNewPayroll] = useState({
    employee_id: 0,
    base_salary: '0',
    performance_bonus: '0',
    special_bonus: '0',
    position_allowance: '0',
    meal_allowance: '0',
    transport_allowance: '0',
    social_insurance: '0',
    personal_tax: '0',
    advance_salary: '0',
    salary_deduction: '0',
    other_deductions: '0'
  });

  const [newOvertime, setNewOvertime] = useState({
    employee_id: 0,
    overtime_date: '',
    start_time: '',
    end_time: '',
    work_description: '',
    reason: 'OTHER',
    priority: 'MEDIUM'
  });

  const [newPoint, setNewPoint] = useState({
    employee_id: 0,
    point_date: '',
    point_type: 'BONUS' as 'BONUS' | 'PENALTY',
    point_amount: '0',
    point_reason: '',
    description: '',
    category: 'PERFORMANCE' as 'PERFORMANCE' | 'ATTENDANCE' | 'TEAMWORK' | 'INNOVATION' | 'OTHER'
  });

  const [newEmployee, setNewEmployee] = useState({
    employee_code: '',
    nick_name: '',
    full_name: '',
    full_name_thai: '',
    department: 'IT',
    start_date: '',
    bank_name: '',
    bank_account: '',
    monthly_salary: '0',
    social_insurance_rate: '5',
    tax_rate: '10',
    performance_rating: 3,
    status: 'ACTIVE',
    photo_url: '',
    photo_filename: ''
  });

  // 회사 설정 상태
  const [companySettings, setCompanySettings] = useState<any>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [newSettings, setNewSettings] = useState({
    company_name: '',
    address: '',
    phone: '',
    email: '',
    website: ''
  });

  // 대시보드 설정 상태
  const [dashboardSettings, setDashboardSettings] = useState({
    showWelcomeMessage: true,
    welcomeMessage: '안녕하세요! 급여 관리 시스템에 오신 것을 환영합니다.',
    defaultView: 'dashboard',
    refreshInterval: 300, // 5분
    showNotifications: true,
    showQuickActions: true,
    showRecentActivity: true,
    showStatistics: true,
    theme: 'light',
    language: 'ko',
    dateFormat: 'YYYY-MM-DD',
    currency: 'KRW',
    timezone: 'Asia/Seoul',
    logoUrl: '',
    logoText: '급여관리',
    showLogo: true
  });
  const [showDashboardSettingsModal, setShowDashboardSettingsModal] = useState(false);

  // 관리자 관련 상태
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    username: 'admin',
    name: '관리자',
    role: 'SUPER_ADMIN' as 'SUPER_ADMIN' | 'HR_ADMIN' | 'FINANCE_ADMIN',
    email: 'admin@company.com',
    status: 'ACTIVE'
  });
  const [isAdmin, setIsAdmin] = useState(true); // 임시로 관리자로 설정
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, username: 'admin', name: '관리자', role: 'SUPER_ADMIN', email: 'admin@company.com', status: 'ACTIVE' },
    { id: 2, username: 'finance', name: '회계팀', role: 'FINANCE_ADMIN', email: 'finance@company.com', status: 'ACTIVE' },
    { id: 3, username: 'hr', name: '인사팀', role: 'HR_ADMIN', email: 'hr@company.com', status: 'ACTIVE' }
  ]);

  // 급여 보기/수정 관련 상태
  const [showPayrollViewModal, setShowPayrollViewModal] = useState(false);
  const [showPayrollEditModal, setShowPayrollEditModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollStatement | null>(null);

  // 오버타임 보기/수정 관련 상태
  const [showOvertimeViewModal, setShowOvertimeViewModal] = useState(false);
  const [showOvertimeEditModal, setShowOvertimeEditModal] = useState(false);
  const [selectedOvertime, setSelectedOvertime] = useState<OvertimeRecord | null>(null);

  // 직원 보기/수정 관련 상태
  const [showEmployeeViewModal, setShowEmployeeViewModal] = useState(false);
  const [showEmployeeEditModal, setShowEmployeeEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // 포인트 보기/수정 관련 상태
  const [showPointViewModal, setShowPointViewModal] = useState(false);
  const [showPointEditModal, setShowPointEditModal] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<PointRecord | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 부서 관리 관련 상태
  const [departments, setDepartments] = useState<any[]>([]);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [newDepartment, setNewDepartment] = useState({
    department_code: '',
    department_name: '',
    department_description: '',
    budget: '',
    status: 'ACTIVE'
  });
  const [newAdminUser, setNewAdminUser] = useState({
    username: '',
    name: '',
    email: '',
    role: 'HR',
    password: ''
  });

  // 권한 확인 함수들
  const canAccessPayroll = () => {
    return currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'FINANCE_ADMIN';
  };

  const canAccessAdmin = () => {
    return currentUser.role === 'SUPER_ADMIN';
  };

  const canAccessEmployeeManagement = () => {
    return currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'HR_ADMIN';
  };

  const canAccessOvertime = () => {
    return currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'HR_ADMIN';
  };

  const canAccessPoints = () => {
    return currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'HR_ADMIN';
  };

  // 데이터 로드
  useEffect(() => {
    loadData();
  }, [selectedYear, selectedMonth]);

  // 초기 로딩 상태 해제 (데이터 로드 실패 시에도 UI 표시)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.log('데이터 로드 타임아웃, 로딩 상태 해제');
        setLoading(false);
      }
    }, 5000); // 5초 후 타임아웃

    return () => clearTimeout(timer);
  }, [loading]);

  // 컴포넌트 마운트 시 로딩 상태 해제
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3초 후 강제로 로딩 상태 해제

    return () => clearTimeout(timer);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Supabase 연결 확인
      if (!supabase) {
        console.error('Supabase 클라이언트가 초기화되지 않았습니다.');
        setLoading(false);
        return;
      }

      console.log('데이터 로드 시작...');

      // 직원 데이터 로드 (모든 상태 포함)
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .order('employee_code');

      if (employeesError) {
        console.error('직원 데이터 로드 오류:', employeesError);
        // 오류가 있어도 계속 진행
      }
      setEmployees(employeesData || []);
      console.log('직원 데이터 로드 완료:', employeesData?.length || 0);

      // 부서 데이터 로드
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('*')
        .order('department_name');

      if (departmentsError) {
        console.error('부서 데이터 로드 오류:', departmentsError);
        // 오류가 있어도 계속 진행
      }
      setDepartments(departmentsData || []);
      console.log('부서 데이터 로드 완료:', departmentsData?.length || 0);

      // 포인트 데이터 로드
      const { data: pointData, error: pointError } = await supabase
        .from('point_records')
        .select(`
          *,
          employees (
            employee_code,
            nick_name,
            full_name,
            department
          )
        `)
        .order('point_date', { ascending: false });

      if (pointError) {
        console.error('포인트 데이터 로드 오류:', pointError);
        // 오류가 있어도 계속 진행
      }
      setPointData(pointData || []);
      console.log('포인트 데이터 로드 완료:', pointData?.length || 0);

      // 포인트 요약 데이터 로드
      const { data: pointSummaryData, error: pointSummaryError } = await supabase
        .from('employee_point_summary')
        .select('*')
        .order('total_points', { ascending: false });

      if (pointSummaryError) {
        console.error('포인트 요약 데이터 로드 오류:', pointSummaryError);
        // 오류가 있어도 계속 진행
      }
      setPointSummary(pointSummaryData || []);
      console.log('포인트 요약 데이터 로드 완료:', pointSummaryData?.length || 0);

      // 급여 데이터 로드
      const { data: payrollData, error: payrollError } = await supabase
        .from('payroll_statements')
        .select(`
          *,
          employees (
            employee_code,
            nick_name,
            full_name,
            department
          )
        `)
        .eq('pay_year', selectedYear)
        .eq('pay_month', selectedMonth);

      if (payrollError) {
        console.error('급여 데이터 로드 오류:', payrollError);
        // 오류가 있어도 계속 진행
      }
      setPayrollData(payrollData || []);
      console.log('급여 데이터 로드 완료:', payrollData?.length || 0);

      // 오버타임 데이터 로드
      const { data: overtimeData, error: overtimeError } = await supabase
        .from('overtime_records')
        .select(`
          *,
          employees (
            employee_code,
            nick_name
          )
        `)
        .eq('overtime_date', `${selectedYear}-${getMonthNumber(selectedMonth)}-01`);

      if (overtimeError) {
        console.error('오버타임 데이터 로드 오류:', overtimeError);
        // 오류가 있어도 계속 진행
      }
      setOvertimeData(overtimeData || []);
      console.log('오버타임 데이터 로드 완료:', overtimeData?.length || 0);

      // 회사 설정 로드
      const { data: settingsData, error: settingsError } = await supabase
        .from('company_settings')
        .select('*')
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('회사 설정 로드 오류:', settingsError);
        // 오류가 있어도 기본값 사용
        setCompanySettings(null);
      } else {
        setCompanySettings(settingsData || null);
        if (settingsData) {
          setNewSettings({
            company_name: settingsData.company_name || '',
            address: settingsData.address || '',
            phone: settingsData.phone || '',
            email: settingsData.email || '',
            website: settingsData.website || ''
          });
        }
      }
      console.log('회사 설정 로드 완료');

      // 대시보드 설정 로드
      const { data: dashboardSettingsData, error: dashboardSettingsError } = await supabase
        .from('dashboard_settings')
        .select('*')
        .single();

      if (dashboardSettingsError && dashboardSettingsError.code !== 'PGRST116') {
        console.error('대시보드 설정 로드 오류:', dashboardSettingsError);
        // 테이블이 없으면 기본 설정으로 초기화
        const { error: insertError } = await supabase
          .from('dashboard_settings')
          .insert([{
            id: 1,
            show_welcome_message: true,
            welcome_message: '안녕하세요! 급여 관리 시스템에 오신 것을 환영합니다.',
            default_view: 'dashboard',
            refresh_interval: 300,
            show_notifications: true,
            show_quick_actions: true,
            show_recent_activity: true,
            show_statistics: true,
            theme: 'light',
            language: 'ko',
            date_format: 'YYYY-MM-DD',
            currency: 'KRW',
            timezone: 'Asia/Seoul',
            logo_url: '',
            logo_text: '급여관리',
            show_logo: true
          }]);
        
        if (insertError) {
          console.error('대시보드 설정 초기화 오류:', insertError);
        }
      } else if (dashboardSettingsData) {
        setDashboardSettings({
          showWelcomeMessage: dashboardSettingsData.show_welcome_message || true,
          welcomeMessage: dashboardSettingsData.welcome_message || '안녕하세요! 급여 관리 시스템에 오신 것을 환영합니다.',
          defaultView: dashboardSettingsData.default_view || 'dashboard',
          refreshInterval: dashboardSettingsData.refresh_interval || 300,
          showNotifications: dashboardSettingsData.show_notifications || true,
          showQuickActions: dashboardSettingsData.show_quick_actions || true,
          showRecentActivity: dashboardSettingsData.show_recent_activity || true,
          showStatistics: dashboardSettingsData.show_statistics || true,
          theme: dashboardSettingsData.theme || 'light',
          language: dashboardSettingsData.language || 'ko',
          dateFormat: dashboardSettingsData.date_format || 'YYYY-MM-DD',
          currency: dashboardSettingsData.currency || 'KRW',
          timezone: dashboardSettingsData.timezone || 'Asia/Seoul',
          logoUrl: dashboardSettingsData.logo_url || '',
          logoText: dashboardSettingsData.logo_text || '급여관리',
          showLogo: dashboardSettingsData.show_logo !== false
        });
      }
      console.log('대시보드 설정 로드 완료');

    } catch (error) {
      console.error('데이터 로드 중 예상치 못한 오류:', error);
      // 오류가 발생해도 로딩 상태를 해제
    } finally {
      console.log('데이터 로드 완료, 로딩 상태 해제');
      setLoading(false);
    }
  };

  const getMonthNumber = (month: string) => {
    const months: { [key: string]: string } = {
      'JANUARY': '01', 'FEBRUARY': '02', 'MARCH': '03', 'APRIL': '04',
      'MAY': '05', 'JUNE': '06', 'JULY': '07', 'AUGUST': '08',
      'SEPTEMBER': '09', 'OCTOBER': '10', 'NOVEMBER': '11', 'DECEMBER': '12'
    };
    return months[month] || '01';
  };

  // 통계 계산
  const totalEmployees = employees.length;
  const totalGrossSalary = payrollData.reduce((sum, emp) => {
    const gross = emp.base_salary + 
                  (emp.total_overtime_hours * emp.overtime_rate) + 
                  emp.performance_bonus + 
                  emp.special_bonus + 
                  emp.position_allowance + 
                  emp.meal_allowance + 
                  emp.transport_allowance;
    return sum + gross;
  }, 0);
  const totalOvertimeHours = payrollData.reduce((sum, emp) => sum + emp.total_overtime_hours, 0);
  const pendingApprovals = payrollData.filter(emp => emp.status === 'DRAFT').length;

  // 필터링된 데이터
  const filteredPayrollData = payrollData.filter(emp => {
    const employee = emp.employees as any;
    return employee?.nick_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           employee?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           employee?.employee_code?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // 오버타임 승인/거부 함수
  const handleOvertimeAction = async (overtimeId: number, action: 'APPROVE' | 'REJECT', reason?: string) => {
    try {
      const { error } = await supabase.rpc('approve_overtime_record', {
        p_overtime_id: overtimeId,
        p_admin_id: 1, // 실제로는 로그인된 관리자 ID
        p_status: action,
        p_rejection_reason: reason
      });

      if (error) throw error;
      loadData(); // 데이터 새로고침
    } catch (error) {
      console.error('오버타임 처리 오류:', error);
    }
  };

  const handleAddPayroll = async () => {
    try {
      if (!newPayroll.employee_id || !newPayroll.base_salary || Number(newPayroll.base_salary) <= 0) {
        alert('직원을 선택하고 기본급을 입력해주세요.');
        return;
      }

      const { data, error } = await supabase
        .from('payroll_statements')
        .insert([
          {
            employee_id: newPayroll.employee_id,
            pay_year: selectedYear,
            pay_month: selectedMonth,
            pay_period_start: `${selectedYear}-${getMonthNumber(selectedMonth)}-01`,
            pay_period_end: `${selectedYear}-${getMonthNumber(selectedMonth)}-31`,
            payment_date: new Date().toISOString().split('T')[0],
            work_days: 22,
            actual_work_days: 22,
            base_salary: Number(newPayroll.base_salary) || 0,
            hourly_rate: 0,
            overtime_rate: 0,
            performance_bonus: Number(newPayroll.performance_bonus) || 0,
            special_bonus: Number(newPayroll.special_bonus) || 0,
            position_allowance: Number(newPayroll.position_allowance) || 0,
            meal_allowance: Number(newPayroll.meal_allowance) || 0,
            transport_allowance: Number(newPayroll.transport_allowance) || 0,
            total_overtime_hours: 0,
            social_insurance: Number(newPayroll.social_insurance) || 0,
            personal_tax: Number(newPayroll.personal_tax) || 0,
            advance_salary: Number(newPayroll.advance_salary) || 0,
            salary_deduction: Number(newPayroll.salary_deduction) || 0,
            other_deductions: Number(newPayroll.other_deductions) || 0,
            status: 'DRAFT',
            created_by: 1
          }
        ]);

      if (error) throw error;
      alert('급여명세서가 성공적으로 생성되었습니다.');
      setShowPayrollModal(false);
      setNewPayroll({
        employee_id: 0,
        base_salary: '0',
        performance_bonus: '0',
        special_bonus: '0',
        position_allowance: '0',
        meal_allowance: '0',
        transport_allowance: '0',
        social_insurance: '0',
        personal_tax: '0',
        advance_salary: '0',
        salary_deduction: '0',
        other_deductions: '0'
      });
      loadData();
    } catch (error) {
      console.error('급여명세서 생성 오류:', error);
      alert(`급여명세서 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  // 직원 등록 함수 (완전히 개선된 버전)
  const handleAddEmployee = async () => {
    // 로딩 상태 설정
    setIsUploading(true);
    
    // 디버깅 정보 출력
    console.log('=== 직원 등록 디버깅 시작 ===');
    console.log('현재 시간:', new Date().toISOString());
    console.log('Supabase 클라이언트 상태:', !!supabase);
    console.log('입력된 데이터:', JSON.stringify(newEmployee, null, 2));
    
    try {
      console.log('=== 직원 등록 시작 ===');
      console.log('입력된 데이터:', newEmployee);
      
      // 1. 입력값 검증
      const validationErrors = [];
      
      // 필수 필드 검증
      const requiredFields = [
        { key: 'employee_code', label: '직원코드' },
        { key: 'nick_name', label: '닉네임' },
        { key: 'full_name', label: '이름' }
      ];

      for (const field of requiredFields) {
        const value = newEmployee[field.key as keyof typeof newEmployee];
        if (!value || value.toString().trim() === '') {
          validationErrors.push(`${field.label}은(는) 필수 입력 항목입니다.`);
        }
      }

      // 직원코드 형식 검증 (영문자, 숫자만 허용)
      const employeeCode = newEmployee.employee_code?.trim();
      if (employeeCode && !/^[A-Za-z0-9]+$/.test(employeeCode)) {
        validationErrors.push('직원코드는 영문자와 숫자만 사용 가능합니다.');
      }

      // 숫자 필드 검증
      const numericFields = [
        { key: 'monthly_salary', label: '월급', min: 0 },
        { key: 'social_insurance_rate', label: '사회보험률', min: 0, max: 100 },
        { key: 'tax_rate', label: '세율', min: 0, max: 100 }
      ];

      for (const field of numericFields) {
        const value = Number(newEmployee[field.key as keyof typeof newEmployee]);
        if (isNaN(value) || value < field.min) {
          validationErrors.push(`${field.label}은(는) ${field.min} 이상의 숫자여야 합니다.`);
        }
        if (field.max && value > field.max) {
          validationErrors.push(`${field.label}은(는) ${field.max} 이하여야 합니다.`);
        }
      }

      // 검증 오류가 있으면 중단
      if (validationErrors.length > 0) {
        alert(`❌ 입력 오류:\n\n${validationErrors.join('\n')}`);
        return;
      }

      console.log('✅ 입력값 검증 완료');

      // 2. 중복 직원코드 확인
      console.log('중복 확인 중...');
      const { data: existingEmployee, error: checkError } = await supabase
        .from('employees')
        .select('id')
        .eq('employee_code', employeeCode)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('중복 확인 오류:', checkError);
        throw new Error(`중복 확인 오류: ${checkError.message}`);
      }

      if (existingEmployee) {
        alert('❌ 이미 존재하는 직원코드입니다. 다른 직원코드를 사용해주세요.');
        return;
      }

      console.log('✅ 중복 확인 완료');

      // 3. 데이터 준비
      const employeeData = {
        employee_code: employeeCode,
        nick_name: newEmployee.nick_name.trim(),
        full_name: newEmployee.full_name.trim(),
        full_name_thai: newEmployee.full_name_thai?.trim() || null,
        department: newEmployee.department || 'IT',
        start_date: newEmployee.start_date || new Date().toISOString().split('T')[0],
        bank_name: newEmployee.bank_name?.trim() || '미지정',
        bank_account: newEmployee.bank_account?.trim() || '미지정',
        monthly_salary: Number(newEmployee.monthly_salary) || 0,
        hourly_rate: 0,
        overtime_rate: 0,
        social_insurance_rate: Number(newEmployee.social_insurance_rate) || 5,
        tax_rate: Number(newEmployee.tax_rate) || 10,
        performance_rating: Number(newEmployee.performance_rating) || 3,
        status: newEmployee.status || 'ACTIVE',
        photo_url: newEmployee.photo_url || null,
        photo_filename: newEmployee.photo_filename || null
      };

      console.log('사진 URL 포함 여부:', {
        photo_url: newEmployee.photo_url,
        photo_filename: newEmployee.photo_filename
      });

      // 사진 URL이 있으면 유효성 검사 (선택적)
      if (newEmployee.photo_url) {
        console.log('사진 URL 검증 시작:', newEmployee.photo_url);
        try {
          const response = await fetch(newEmployee.photo_url, { method: 'HEAD' });
          if (!response.ok) {
            console.warn('사진 URL이 유효하지 않습니다:', newEmployee.photo_url);
            // URL을 null로 설정하지 않고 그대로 유지 (Storage 버킷이 생성되면 나중에 접근 가능)
          } else {
            console.log('사진 URL 검증 성공');
          }
        } catch (error) {
          console.warn('사진 URL 검증 실패 (무시하고 진행):', error);
          // 오류가 있어도 URL을 유지 (Storage 버킷 생성 후 접근 가능할 수 있음)
        }
      }

      console.log('✅ 데이터 준비 완료:', employeeData);

      // 4. Supabase에 데이터 삽입
      console.log('데이터베이스에 삽입 중...');
      const { data, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select();

      if (error) {
        console.error('Supabase 삽입 오류:', error);
        
        // 구체적인 오류 메시지 처리
        if (error.code === '23502') {
          throw new Error('필수 필드가 누락되었습니다. 모든 필수 항목을 입력해주세요.');
        } else if (error.code === '23505') {
          throw new Error('이미 존재하는 직원코드입니다. 다른 코드를 사용해주세요.');
        } else if (error.code === '23503') {
          throw new Error('참조 오류가 발생했습니다. 부서 정보를 확인해주세요.');
        } else if (error.code === '42P01') {
          throw new Error('테이블을 찾을 수 없습니다. 데이터베이스 설정을 확인해주세요.');
        } else if (error.code === '42501') {
          throw new Error('권한이 없습니다. 관리자에게 문의하세요.');
        } else {
          throw new Error(`데이터베이스 오류: ${error.message}`);
        }
      }

      console.log('✅ 직원 등록 성공:', data);

      // 5. 성공 처리
      alert('✅ 직원이 성공적으로 등록되었습니다!');
      
      // 데이터 새로고침
      await loadData();
      
      // 모달 닫기
      setShowEmployeeModal(false);
      
      // 폼 초기화 (데이터 새로고침 후)
      setNewEmployee({
        employee_code: '',
        nick_name: '',
        full_name: '',
        full_name_thai: '',
        department: 'IT',
        start_date: '',
        bank_name: '',
        bank_account: '',
        monthly_salary: '0',
        social_insurance_rate: '5',
        tax_rate: '10',
        performance_rating: 3,
        status: 'ACTIVE',
        photo_url: '',
        photo_filename: ''
      });
      
      console.log('=== 직원 등록 완료 ===');
      
    } catch (error) {
      console.error('❌ 직원 등록 오류:', error);
      console.error('오류 타입:', typeof error);
      console.error('오류 메시지:', error instanceof Error ? error.message : '알 수 없는 오류');
      console.error('오류 스택:', error instanceof Error ? error.stack : '스택 없음');
      
      // 사용자 친화적인 오류 메시지
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      
      alert(`❌ 직원 등록 실패\n\n오류 내용: ${errorMessage}\n\n해결 방법:\n1. 모든 필수 필드를 입력했는지 확인\n2. 직원코드가 중복되지 않았는지 확인\n3. 숫자 필드에 올바른 값을 입력했는지 확인\n4. 인터넷 연결 상태를 확인\n5. 다시 시도해보세요`);
      
    } finally {
      // 로딩 상태 해제
      setIsUploading(false);
    }
  };

  // 새 오버타임 등록 함수
  // 포커스 시 0을 지우는 핸들러
  const handleNumberFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0') {
      e.target.value = '';
    }
  };

  // 블러 시 빈 값이면 0으로 설정하는 핸들러
  const handleNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      e.target.value = '0';
    }
  };

  // 보고서 생성 함수들
  const generateDashboardReport = () => {
    try {
      const reportContent = `
        <html>
          <head>
            <title>대시보드 리포트 - ${selectedYear}년 ${selectedMonth}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
              .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
              .stat-title { font-weight: bold; color: #666; }
              .stat-value { font-size: 24px; color: #333; margin-top: 5px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>대시보드 리포트</h1>
              <p>${selectedYear}년 ${selectedMonth}</p>
              <p>생성일: ${new Date().toLocaleDateString('ko-KR')}</p>
            </div>
            
            <div class="stats">
              <div class="stat-card">
                <div class="stat-title">총 직원수</div>
                <div class="stat-value">${totalEmployees || 0}명</div>
              </div>
              <div class="stat-card">
                <div class="stat-title">총 급여지급액</div>
                <div class="stat-value">₩${(totalGrossSalary || 0).toLocaleString()}</div>
              </div>
              <div class="stat-card">
                <div class="stat-title">총 오버타임</div>
                <div class="stat-value">${totalOvertimeHours || 0}시간</div>
              </div>
              <div class="stat-card">
                <div class="stat-title">승인 대기</div>
                <div class="stat-value">${pendingApprovals || 0}건</div>
              </div>
            </div>

            <h2>부서별 급여 현황</h2>
            <table>
              <thead>
                <tr>
                  <th>부서</th>
                  <th>직원수</th>
                  <th>총 급여</th>
                  <th>비율</th>
                </tr>
              </thead>
              <tbody>
                ${['IT', 'HR', 'Finance', 'Marketing', 'Sales'].map(dept => {
                  const deptData = (payrollData || []).filter(emp => {
                    const employee = emp.employees as any;
                    return employee?.department === dept;
                  });
                  const deptTotal = deptData.reduce((sum, emp) => {
                    const net = (emp.base_salary || 0) + 
                               ((emp.total_overtime_hours || 0) * (emp.overtime_rate || 0)) + 
                               (emp.performance_bonus || 0) + 
                               (emp.special_bonus || 0) + 
                               (emp.position_allowance || 0) + 
                               (emp.meal_allowance || 0) + 
                               (emp.transport_allowance || 0) - 
                               (emp.social_insurance || 0) - 
                               (emp.personal_tax || 0) - 
                               (emp.advance_salary || 0) - 
                               (emp.salary_deduction || 0) - 
                               (emp.other_deductions || 0);
                    return sum + net;
                  }, 0);
                  const percentage = (totalGrossSalary || 0) > 0 ? (deptTotal / (totalGrossSalary || 1) * 100).toFixed(1) : '0';
                  
                  return `
                    <tr>
                      <td>${dept}</td>
                      <td>${deptData.length}명</td>
                      <td>₩${deptTotal.toLocaleString()}</td>
                      <td>${percentage}%</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(reportContent);
        printWindow.document.close();
        printWindow.print();
      } else {
        alert('팝업이 차단되었습니다. 팝업을 허용해주세요.');
      }
    } catch (error) {
      console.error('대시보드 리포트 생성 오류:', error);
      alert('리포트 생성 중 오류가 발생했습니다.');
    }
  };

  const generatePayrollReport = () => {
    try {
      const reportContent = `
        <html>
          <head>
            <title>급여 리포트 - ${selectedYear}년 ${selectedMonth}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              .total-row { font-weight: bold; background-color: #f0f0f0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>급여 리포트</h1>
              <p>${selectedYear}년 ${selectedMonth}</p>
              <p>생성일: ${new Date().toLocaleDateString('ko-KR')}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>직원</th>
                  <th>부서</th>
                  <th>기본급</th>
                  <th>오버타임</th>
                  <th>보너스</th>
                  <th>수당</th>
                  <th>공제</th>
                  <th>실수령액</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                ${(filteredPayrollData || []).map(emp => {
                  const employee = emp.employees as any;
                  const grossSalary = (emp.base_salary || 0) + 
                                     ((emp.total_overtime_hours || 0) * (emp.overtime_rate || 0)) + 
                                     (emp.performance_bonus || 0) + 
                                     (emp.special_bonus || 0) + 
                                     (emp.position_allowance || 0) + 
                                     (emp.meal_allowance || 0) + 
                                     (emp.transport_allowance || 0);
                  const totalDeductions = (emp.social_insurance || 0) + 
                                         (emp.personal_tax || 0) + 
                                         (emp.advance_salary || 0) + 
                                         (emp.salary_deduction || 0) + 
                                         (emp.other_deductions || 0);
                  const netSalary = grossSalary - totalDeductions;
                  const allowances = (emp.position_allowance || 0) + (emp.meal_allowance || 0) + (emp.transport_allowance || 0);
                  const bonuses = (emp.performance_bonus || 0) + (emp.special_bonus || 0);

                  return `
                    <tr>
                      <td>${employee?.nick_name || 'N/A'} (${employee?.employee_code || 'N/A'})</td>
                      <td>${employee?.department || 'N/A'}</td>
                      <td>₩${(emp.base_salary || 0).toLocaleString()}</td>
                      <td>₩${((emp.total_overtime_hours || 0) * (emp.overtime_rate || 0)).toLocaleString()}</td>
                      <td>₩${bonuses.toLocaleString()}</td>
                      <td>₩${allowances.toLocaleString()}</td>
                      <td>₩${totalDeductions.toLocaleString()}</td>
                      <td>₩${netSalary.toLocaleString()}</td>
                      <td>${emp.status || 'N/A'}</td>
                    </tr>
                  `;
                }).join('')}
                <tr class="total-row">
                  <td colspan="2">총계</td>
                  <td>₩${(payrollData || []).reduce((sum, emp) => sum + (emp.base_salary || 0), 0).toLocaleString()}</td>
                  <td>₩${(payrollData || []).reduce((sum, emp) => sum + ((emp.total_overtime_hours || 0) * (emp.overtime_rate || 0)), 0).toLocaleString()}</td>
                  <td>₩${(payrollData || []).reduce((sum, emp) => sum + (emp.performance_bonus || 0) + (emp.special_bonus || 0), 0).toLocaleString()}</td>
                  <td>₩${(payrollData || []).reduce((sum, emp) => sum + (emp.position_allowance || 0) + (emp.meal_allowance || 0) + (emp.transport_allowance || 0), 0).toLocaleString()}</td>
                  <td>₩${(payrollData || []).reduce((sum, emp) => sum + (emp.social_insurance || 0) + (emp.personal_tax || 0) + (emp.advance_salary || 0) + (emp.salary_deduction || 0) + (emp.other_deductions || 0), 0).toLocaleString()}</td>
                  <td>₩${(payrollData || []).reduce((sum, emp) => {
                    const gross = (emp.base_salary || 0) + ((emp.total_overtime_hours || 0) * (emp.overtime_rate || 0)) + (emp.performance_bonus || 0) + (emp.special_bonus || 0) + (emp.position_allowance || 0) + (emp.meal_allowance || 0) + (emp.transport_allowance || 0);
                    const deductions = (emp.social_insurance || 0) + (emp.personal_tax || 0) + (emp.advance_salary || 0) + (emp.salary_deduction || 0) + (emp.other_deductions || 0);
                    return sum + (gross - deductions);
                  }, 0).toLocaleString()}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(reportContent);
        printWindow.document.close();
        printWindow.print();
      } else {
        alert('팝업이 차단되었습니다. 팝업을 허용해주세요.');
      }
    } catch (error) {
      console.error('급여 리포트 생성 오류:', error);
      alert('리포트 생성 중 오류가 발생했습니다.');
    }
  };

  const generateOvertimeReport = () => {
    try {
      const reportContent = `
        <html>
          <head>
            <title>오버타임 리포트 - ${selectedYear}년 ${selectedMonth}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>오버타임 리포트</h1>
              <p>${selectedYear}년 ${selectedMonth}</p>
              <p>생성일: ${new Date().toLocaleDateString('ko-KR')}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>직원</th>
                  <th>날짜</th>
                  <th>시간</th>
                  <th>업무 내용</th>
                  <th>우선순위</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                ${(overtimeData || []).map(ot => {
                  const employee = ot.employees as any;
                  return `
                    <tr>
                      <td>${employee?.nick_name || 'N/A'} (${employee?.employee_code || 'N/A'})</td>
                      <td>${ot.overtime_date || 'N/A'}</td>
                      <td>${ot.start_time || 'N/A'} - ${ot.end_time || 'N/A'} (${ot.overtime_hours || 0}시간)</td>
                      <td>${ot.work_description || 'N/A'}</td>
                      <td>${ot.priority || 'N/A'}</td>
                      <td>${ot.status || 'N/A'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(reportContent);
        printWindow.document.close();
        printWindow.print();
      } else {
        alert('팝업이 차단되었습니다. 팝업을 허용해주세요.');
      }
    } catch (error) {
      console.error('오버타임 리포트 생성 오류:', error);
      alert('리포트 생성 중 오류가 발생했습니다.');
    }
  };

  const generateEmployeeReport = () => {
    try {
      const reportContent = `
        <html>
          <head>
            <title>직원 리포트</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>직원 리포트</h1>
              <p>생성일: ${new Date().toLocaleDateString('ko-KR')}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>직원 코드</th>
                  <th>이름</th>
                  <th>부서</th>
                  <th>입사일</th>
                  <th>월급</th>
                  <th>성과평가</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                ${(employees || []).map(emp => `
                  <tr>
                    <td>${emp.employee_code || 'N/A'}</td>
                    <td>${emp.nick_name || 'N/A'} (${emp.full_name || 'N/A'})</td>
                    <td>${emp.department || 'N/A'}</td>
                    <td>${emp.start_date || 'N/A'}</td>
                    <td>₩${(emp.monthly_salary || 0).toLocaleString()}</td>
                    <td>${emp.performance_rating || 'N/A'}</td>
                    <td>${emp.status || 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(reportContent);
        printWindow.document.close();
        printWindow.print();
      } else {
        alert('팝업이 차단되었습니다. 팝업을 허용해주세요.');
      }
    } catch (error) {
      console.error('직원 리포트 생성 오류:', error);
      alert('리포트 생성 중 오류가 발생했습니다.');
    }
  };

  const generatePointReport = () => {
    try {
      const reportContent = `
        <html>
          <head>
            <title>인사고과 포인트 리포트 - ${new Date().toLocaleDateString()}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              .positive { color: green; font-weight: bold; }
              .negative { color: red; font-weight: bold; }
              .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
              .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>인사고과 포인트 리포트</h1>
              <p>생성일: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="stats">
              <div class="stat-card">
                <h3>총 포인트</h3>
                <p style="font-size: 24px; font-weight: bold;">${pointSummary.reduce((sum, emp) => sum + emp.total_points, 0)}</p>
              </div>
              <div class="stat-card">
                <h3>가산점</h3>
                <p style="font-size: 24px; font-weight: bold; color: green;">+${pointSummary.reduce((sum, emp) => sum + emp.bonus_points, 0)}</p>
              </div>
              <div class="stat-card">
                <h3>감점</h3>
                <p style="font-size: 24px; font-weight: bold; color: red;">-${pointSummary.reduce((sum, emp) => sum + emp.penalty_points, 0)}</p>
              </div>
              <div class="stat-card">
                <h3>평가 대상</h3>
                <p style="font-size: 24px; font-weight: bold;">${pointSummary.length}</p>
              </div>
            </div>
            
            <h2>직원별 포인트 요약</h2>
            <table>
              <thead>
                <tr>
                  <th>직원</th>
                  <th>부서</th>
                  <th>총 포인트</th>
                  <th>가산점</th>
                  <th>감점</th>
                  <th>평가 횟수</th>
                </tr>
              </thead>
              <tbody>
                ${pointSummary.map(emp => `
                  <tr>
                    <td>${emp.nick_name} (${emp.employee_code})</td>
                    <td>${emp.department || 'N/A'}</td>
                    <td class="${emp.total_points > 0 ? 'positive' : emp.total_points < 0 ? 'negative' : ''}">
                      ${emp.total_points > 0 ? '+' : ''}${emp.total_points}
                    </td>
                    <td class="positive">+${emp.bonus_points}</td>
                    <td class="negative">-${emp.penalty_points}</td>
                    <td>${emp.total_records}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <h2>포인트 상세 기록</h2>
            <table>
              <thead>
                <tr>
                  <th>직원</th>
                  <th>날짜</th>
                  <th>유형</th>
                  <th>포인트</th>
                  <th>사유</th>
                  <th>카테고리</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                ${pointData.map(point => {
                  const employee = point.employees as any;
                  return `
                    <tr>
                      <td>${employee?.nick_name || 'N/A'} (${employee?.employee_code || 'N/A'})</td>
                      <td>${point.point_date || 'N/A'}</td>
                      <td>${point.point_type === 'BONUS' ? '가산점' : '감점'}</td>
                      <td class="${point.point_amount > 0 ? 'positive' : 'negative'}">
                        ${point.point_amount > 0 ? '+' : ''}${point.point_amount}
                      </td>
                      <td>${point.point_reason || 'N/A'}</td>
                      <td>${point.category || 'N/A'}</td>
                      <td>${point.status === 'APPROVED' ? '승인' : 
                           point.status === 'PENDING' ? '대기' : '거부'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(reportContent);
        newWindow.document.close();
        newWindow.print();
      }
    } catch (error) {
      console.error('포인트 리포트 생성 오류:', error);
      alert('포인트 리포트 생성 중 오류가 발생했습니다.');
    }
  };

  const handleAddOvertime = async () => {
    try {
      if (!newOvertime.employee_id || !newOvertime.overtime_date || !newOvertime.start_time || !newOvertime.end_time) {
        alert('필수 필드를 입력해주세요.');
        return;
      }

      const { data, error } = await supabase
        .from('overtime_records')
        .insert([
          {
            employee_id: newOvertime.employee_id,
            overtime_date: newOvertime.overtime_date,
            start_time: newOvertime.start_time,
            end_time: newOvertime.end_time,
            work_description: newOvertime.work_description,
            reason: newOvertime.reason,
            priority: newOvertime.priority,
            status: 'PENDING'
          }
        ]);

      if (error) throw error;
      alert('오버타임이 성공적으로 등록되었습니다.');
      setShowOvertimeModal(false);
      setNewOvertime({
        employee_id: 0,
        overtime_date: '',
        start_time: '',
        end_time: '',
        work_description: '',
        reason: 'OTHER',
        priority: 'MEDIUM'
      });
      loadData();
    } catch (error) {
      console.error('오버타임 등록 오류:', error);
      alert('오버타임 등록 중 오류가 발생했습니다.');
    }
  };

  // 로고 업로드 핸들러
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 검증 (5MB 이하)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    try {
      // Storage 버킷 확인
      console.log('Storage 버킷 목록 조회 시작...');
      console.log('현재 Supabase URL:', supabase.supabaseUrl);
      console.log('현재 Supabase Key (앞 10자리):', supabase.supabaseKey?.substring(0, 10) + '...');
      
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.error('버킷 목록 조회 오류:', bucketError);
        console.error('오류 상세 정보:', {
          message: bucketError.message,
          details: bucketError.details,
          hint: bucketError.hint
        });
        alert(`Storage 버킷을 확인할 수 없습니다. 오류: ${bucketError.message}`);
        return;
      }

      console.log('사용 가능한 버킷 목록:', buckets?.map(b => b.name));
      console.log('버킷 상세 정보:', buckets);
      
      const logosBucketExists = buckets?.some(bucket => bucket.name === 'dashboard-logos');
      console.log('dashboard-logos 버킷 존재 여부:', logosBucketExists);
      
      if (!logosBucketExists) {
        const availableBuckets = buckets?.map(b => b.name).join(', ') || '없음';
        alert(`dashboard-logos 버킷이 존재하지 않습니다.\n\n현재 사용 가능한 버킷:\n${availableBuckets}\n\nSupabase 대시보드에서 Storage → New bucket → Name: dashboard-logos, Public bucket 체크 후 생성해주세요.`);
        return;
      }

      // Supabase Storage에 업로드
      const fileName = `logo_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('dashboard-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage 업로드 오류:', uploadError);
        alert(`Storage 업로드 오류: ${uploadError.message}`);
        return;
      }

      // 공개 URL 가져오기
      const { data: urlData } = supabase.storage
        .from('dashboard-logos')
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        alert('공개 URL을 생성할 수 없습니다.');
        return;
      }

      // 데이터베이스에 로고 정보 저장
      console.log('데이터베이스 저장 시작:', {
        id: 1,
        logo_url: urlData.publicUrl,
        logo_filename: fileName
      });
      
      const { data: dbData, error: dbError } = await supabase
        .from('dashboard_settings')
        .upsert({
          id: 1,
          logo_url: urlData.publicUrl,
          logo_filename: fileName
        })
        .select();

      if (dbError) {
        console.error('데이터베이스 저장 오류:', dbError);
        console.error('오류 상세 정보:', {
          message: dbError.message,
          details: dbError.details,
          hint: dbError.hint,
          code: dbError.code
        });
        alert(`데이터베이스 저장 오류: ${dbError.message}\n\n상세: ${dbError.details || '알 수 없는 오류'}`);
        return;
      }

      console.log('데이터베이스 저장 성공:', dbData);

      alert('로고가 성공적으로 업로드되었습니다.');
      loadData(); // 데이터 새로고침
    } catch (error) {
      console.error('로고 업로드 오류:', error);
      alert(`로고 업로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  // 설정 저장 핸들러
  const handleSaveSettings = async () => {
    try {
      console.log('설정 저장 시작:', {
        id: 1,
        company_name: newSettings.company_name,
        address: newSettings.address,
        phone: newSettings.phone,
        email: newSettings.email,
        website: newSettings.website
      });

      const { data, error } = await supabase
        .from('company_settings')
        .upsert({
          id: 1,
          company_name: newSettings.company_name,
          address: newSettings.address,
          phone: newSettings.phone,
          email: newSettings.email,
          website: newSettings.website
        })
        .select();

      if (error) {
        console.error('설정 저장 오류:', error);
        console.error('오류 상세 정보:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        alert(`설정 저장 오류: ${error.message}\n\n상세: ${error.details || '알 수 없는 오류'}`);
        return;
      }

      console.log('설정 저장 성공:', data);
      alert('설정이 성공적으로 저장되었습니다.');
      setShowSettingsModal(false);
      loadData(); // 데이터 새로고침
    } catch (error) {
      console.error('설정 저장 중 예상치 못한 오류:', error);
      alert(`설정 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  // 대시보드 로고 업로드 핸들러
  const handleDashboardLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // 파일 크기 검증 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 파일 형식 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      // Storage 버킷 확인 (에러 처리 개선)
      console.log('Storage 버킷 목록 조회 시작...');
      
      // 버킷 목록 조회 시도 (실패해도 계속 진행)
      try {
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        
        if (bucketError) {
          console.error('버킷 목록 조회 오류:', bucketError);
          console.error('오류 상세 정보:', {
            message: bucketError.message,
            details: bucketError.details,
            hint: bucketError.hint
          });
          console.log('버킷 목록 조회 실패, 직접 업로드 시도...');
        } else {
          console.log('사용 가능한 버킷 목록:', buckets?.map(b => b.name));
          const companyLogosBucketExists = buckets?.some(bucket => bucket.name === 'company-logos');
          console.log('company-logos 버킷 존재 여부:', companyLogosBucketExists);
          
          if (!companyLogosBucketExists) {
            const availableBuckets = buckets?.map(b => b.name).join(', ') || '없음';
            console.log('company-logos 버킷이 목록에 없음, 직접 업로드 시도...');
          }
        }
      } catch (error) {
        console.error('버킷 목록 조회 중 예외 발생:', error);
        console.log('예외 발생, 직접 업로드 시도...');
      }

      // 안전한 파일명 생성
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop();
      const safeFileName = `dashboard_logo_${timestamp}.${fileExtension}`;

      // Supabase Storage에 업로드 (에러 처리 강화)
      console.log('Storage 업로드 시작:', {
        bucket: 'company-logos',
        fileName: safeFileName,
        fileSize: file.size,
        fileType: file.type
      });

      // 여러 버킷 시도
      const bucketsToTry = ['company-logos', 'dashboard-logos', 'logos'];
      let uploadSuccess = false;
      let finalUrl = null;
      let lastError = null;

      for (const bucketName of bucketsToTry) {
        try {
          console.log(`${bucketName} 버킷으로 업로드 시도...`);
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(safeFileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error(`${bucketName} 버킷 업로드 실패:`, uploadError);
            lastError = uploadError;
            continue;
          }

          // 공개 URL 생성
          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(safeFileName);

          if (urlData?.publicUrl) {
            console.log(`${bucketName} 버킷 업로드 성공!`);
            uploadSuccess = true;
            finalUrl = urlData.publicUrl;
            break;
          } else {
            console.error(`${bucketName} 버킷에서 공개 URL 생성 실패`);
            lastError = new Error('공개 URL 생성 실패');
          }
        } catch (error) {
          console.error(`${bucketName} 버킷 시도 중 예외 발생:`, error);
          lastError = error;
        }
      }

      if (!uploadSuccess) {
        console.error('모든 버킷 시도 실패:', lastError);
        alert(`로고 업로드 실패: ${lastError?.message || '알 수 없는 오류'}\n\n시도한 버킷: ${bucketsToTry.join(', ')}`);
        return;
      }

      // 성공 시 설정 업데이트
      setDashboardSettings({
        ...dashboardSettings,
        logoUrl: finalUrl
      });


    } catch (error) {
      console.error('로고 업로드 오류:', error);
      alert(`로고 업로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // 대시보드 설정 저장 핸들러
  const handleSaveDashboardSettings = async () => {
    try {
      const { error } = await supabase
        .from('dashboard_settings')
        .upsert({
          id: 1,
          show_welcome_message: dashboardSettings.showWelcomeMessage,
          welcome_message: dashboardSettings.welcomeMessage,
          default_view: dashboardSettings.defaultView,
          refresh_interval: dashboardSettings.refreshInterval,
          show_notifications: dashboardSettings.showNotifications,
          show_quick_actions: dashboardSettings.showQuickActions,
          show_recent_activity: dashboardSettings.showRecentActivity,
          show_statistics: dashboardSettings.showStatistics,
          theme: dashboardSettings.theme,
          language: dashboardSettings.language,
          date_format: dashboardSettings.dateFormat,
          currency: dashboardSettings.currency,
          timezone: dashboardSettings.timezone,
          logo_url: dashboardSettings.logoUrl,
          logo_text: dashboardSettings.logoText,
          show_logo: dashboardSettings.showLogo
        });

      if (error) throw error;

      alert('대시보드 설정이 성공적으로 저장되었습니다.');
      setShowDashboardSettingsModal(false);
    } catch (error) {
      console.error('대시보드 설정 저장 오류:', error);
      alert('대시보드 설정 저장 중 오류가 발생했습니다.');
    }
  };

  // 관리자 관련 함수들
  const handleAddAdminUser = () => {
    if (!newAdminUser.username || !newAdminUser.name || !newAdminUser.email || !newAdminUser.password) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const newUser = {
      id: adminUsers.length + 1,
      ...newAdminUser,
      status: 'ACTIVE'
    };

    setAdminUsers([...adminUsers, newUser]);
    setNewAdminUser({
      username: '',
      name: '',
      email: '',
      role: 'HR',
      password: ''
    });
    alert('관리자 사용자가 추가되었습니다.');
  };

  const handleDeleteAdminUser = (userId: number) => {
    if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      setAdminUsers(adminUsers.filter(user => user.id !== userId));
      alert('사용자가 삭제되었습니다.');
    }
  };

  const handleToggleUserStatus = (userId: number) => {
    setAdminUsers(adminUsers.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
        : user
    ));
  };

  // 급여 보기/수정 함수들
  const handleViewPayroll = (payroll: PayrollStatement) => {
    setSelectedPayroll(payroll);
    setShowPayrollViewModal(true);
  };

  const handleEditPayroll = (payroll: PayrollStatement) => {
    setSelectedPayroll(payroll);
    setEditingPayroll(payroll);
    setNewPayroll({
      employee_id: payroll.employee_id,
      base_salary: payroll.base_salary.toString(),
      performance_bonus: payroll.performance_bonus.toString(),
      special_bonus: payroll.special_bonus.toString(),
      position_allowance: payroll.position_allowance.toString(),
      meal_allowance: payroll.meal_allowance.toString(),
      transport_allowance: payroll.transport_allowance.toString(),
      social_insurance: payroll.social_insurance.toString(),
      personal_tax: payroll.personal_tax.toString(),
      advance_salary: payroll.advance_salary.toString(),
      salary_deduction: payroll.salary_deduction.toString(),
      other_deductions: payroll.other_deductions.toString()
    });
    setShowPayrollEditModal(true);
  };

  const handleUpdatePayroll = async () => {
    if (!selectedPayroll) {
      alert('선택된 급여명세서가 없습니다.');
      return;
    }

    // 입력값 검증
    const requiredFields = [
      'base_salary', 'performance_bonus', 'special_bonus', 
      'position_allowance', 'meal_allowance', 'transport_allowance',
      'social_insurance', 'personal_tax', 'advance_salary', 
      'salary_deduction', 'other_deductions'
    ];

    for (const field of requiredFields) {
      const value = newPayroll[field as keyof typeof newPayroll];
      if (value === '' || value === null || value === undefined) {
        alert(`${field} 필드가 비어있습니다. 모든 필드를 입력해주세요.`);
        return;
      }
    }

    try {
      console.log('급여 수정 시작:', {
        id: selectedPayroll.id,
        data: newPayroll
      });

      const updateData = {
        base_salary: Number(newPayroll.base_salary) || 0,
        performance_bonus: Number(newPayroll.performance_bonus) || 0,
        special_bonus: Number(newPayroll.special_bonus) || 0,
        position_allowance: Number(newPayroll.position_allowance) || 0,
        meal_allowance: Number(newPayroll.meal_allowance) || 0,
        transport_allowance: Number(newPayroll.transport_allowance) || 0,
        social_insurance: Number(newPayroll.social_insurance) || 0,
        personal_tax: Number(newPayroll.personal_tax) || 0,
        advance_salary: Number(newPayroll.advance_salary) || 0,
        salary_deduction: Number(newPayroll.salary_deduction) || 0,
        other_deductions: Number(newPayroll.other_deductions) || 0,
        updated_at: new Date().toISOString()
      };

      console.log('업데이트 데이터:', updateData);

      const { data, error } = await supabase
        .from('payroll_statements')
        .update(updateData)
        .eq('id', selectedPayroll.id)
        .select();

      if (error) {
        console.error('Supabase 오류:', error);
        throw new Error(`데이터베이스 오류: ${error.message}`);
      }

      console.log('업데이트 성공:', data);

      alert('급여명세서가 성공적으로 수정되었습니다.');
      setShowPayrollEditModal(false);
      setSelectedPayroll(null);
      setEditingPayroll(null);
      loadData();
    } catch (error) {
      console.error('급여명세서 수정 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`급여명세서 수정 중 오류가 발생했습니다.\n\n오류 내용: ${errorMessage}`);
    }
  };

  // 급여 상태 변경 함수
  const handlePayrollStatusChange = async (payrollId: number, newStatus: 'DRAFT' | 'PENDING' | 'APPROVED') => {
    try {
      const { error } = await supabase
        .from('payroll_statements')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', payrollId);

      if (error) throw error;

      alert(`급여 상태가 ${newStatus}로 변경되었습니다.`);
      loadData();
    } catch (error) {
      console.error('급여 상태 변경 오류:', error);
      alert('급여 상태 변경 중 오류가 발생했습니다.');
    }
  };

  // 오버타임 보기/수정 함수들
  const handleViewOvertime = (overtime: OvertimeRecord) => {
    setSelectedOvertime(overtime);
    setShowOvertimeViewModal(true);
  };

  const handleEditOvertime = (overtime: OvertimeRecord) => {
    setSelectedOvertime(overtime);
    setEditingOvertime(overtime);
    setNewOvertime({
      employee_id: overtime.employee_id,
      overtime_date: overtime.overtime_date,
      start_time: overtime.start_time,
      end_time: overtime.end_time,
      work_description: overtime.work_description,
      reason: overtime.reason,
      priority: overtime.priority
    });
    setShowOvertimeEditModal(true);
  };

  const handleUpdateOvertime = async () => {
    if (!selectedOvertime) {
      alert('선택된 오버타임이 없습니다.');
      return;
    }

    // 입력값 검증
    if (!newOvertime.overtime_date || !newOvertime.start_time || !newOvertime.end_time || !newOvertime.work_description) {
      alert('모든 필수 필드를 입력해주세요.');
      return;
    }

    try {
      console.log('오버타임 수정 시작:', {
        id: selectedOvertime.id,
        data: newOvertime
      });

      const updateData = {
        overtime_date: newOvertime.overtime_date,
        start_time: newOvertime.start_time,
        end_time: newOvertime.end_time,
        work_description: newOvertime.work_description,
        reason: newOvertime.reason || 'OTHER',
        priority: newOvertime.priority || 'MEDIUM',
        updated_at: new Date().toISOString()
      };

      console.log('업데이트 데이터:', updateData);

      const { data, error } = await supabase
        .from('overtime_records')
        .update(updateData)
        .eq('id', selectedOvertime.id)
        .select();

      if (error) {
        console.error('Supabase 오류:', error);
        throw new Error(`데이터베이스 오류: ${error.message}`);
      }

      console.log('업데이트 성공:', data);

      alert('오버타임이 성공적으로 수정되었습니다.');
      setShowOvertimeEditModal(false);
      setSelectedOvertime(null);
      setEditingOvertime(null);
      loadData();
    } catch (error) {
      console.error('오버타임 수정 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`오버타임 수정 중 오류가 발생했습니다.\n\n오류 내용: ${errorMessage}`);
    }
  };

  // 직원 보기/수정 함수들
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeViewModal(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditingEmployee(employee);
    setNewEmployee({
      employee_code: employee.employee_code,
      nick_name: employee.nick_name,
      full_name: employee.full_name,
      full_name_thai: employee.full_name_thai || '',
      department: employee.department,
      start_date: employee.start_date,
      bank_name: employee.bank_name || '',
      bank_account: employee.bank_account || '',
      monthly_salary: employee.monthly_salary.toString(),
      social_insurance_rate: employee.social_insurance_rate.toString(),
      tax_rate: employee.tax_rate.toString(),
      performance_rating: employee.performance_rating || 3,
      status: employee.status || 'ACTIVE',
      photo_url: employee.photo_url || '',
      photo_filename: employee.photo_filename || ''
    });
    setShowEmployeeEditModal(true);
  };

  // 직원 정보 수정 함수 (개선된 버전)
  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) {
      alert('❌ 선택된 직원이 없습니다.');
      return;
    }

    try {
      console.log('직원 수정 시작:', {
        id: selectedEmployee.id,
        currentData: selectedEmployee,
        newData: newEmployee
      });

      // 1. 입력값 검증
      const validationErrors = [];
      
      // 필수 필드 검증
      const requiredFields = [
        { key: 'employee_code', label: '직원코드' },
        { key: 'nick_name', label: '닉네임' },
        { key: 'full_name', label: '이름' },
        { key: 'department', label: '부서' },
        { key: 'start_date', label: '입사일' }
      ];

      for (const field of requiredFields) {
        const value = newEmployee[field.key as keyof typeof newEmployee];
        if (!value || value.toString().trim() === '') {
          validationErrors.push(`${field.label}은(는) 필수 입력 항목입니다.`);
        }
      }

      // 숫자 필드 검증
      const numericFields = [
        { key: 'monthly_salary', label: '월급', min: 0 },
        { key: 'social_insurance_rate', label: '사회보험률', min: 0, max: 100 },
        { key: 'tax_rate', label: '세율', min: 0, max: 100 }
      ];

      for (const field of numericFields) {
        const value = Number(newEmployee[field.key as keyof typeof newEmployee]);
        if (isNaN(value) || value < field.min) {
          validationErrors.push(`${field.label}은(는) ${field.min} 이상의 숫자여야 합니다.`);
        }
        if (field.max && value > field.max) {
          validationErrors.push(`${field.label}은(는) ${field.max} 이하여야 합니다.`);
        }
      }

      // 검증 오류가 있으면 중단
      if (validationErrors.length > 0) {
        alert(`❌ 입력 오류:\n\n${validationErrors.join('\n')}`);
        return;
      }

      console.log('입력값 검증 완료');

      // 2. 중복 직원코드 확인 (자신 제외)
      const { data: existingEmployee, error: checkError } = await supabase
        .from('employees')
        .select('id')
        .eq('employee_code', newEmployee.employee_code.trim())
        .neq('id', selectedEmployee.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('중복 확인 오류:', checkError);
        throw new Error(`중복 확인 오류: ${checkError.message}`);
      }

      if (existingEmployee) {
        alert('❌ 이미 존재하는 직원코드입니다. 다른 직원코드를 사용해주세요.');
        return;
      }

      console.log('중복 확인 완료');

      // 3. 업데이트 데이터 준비
      const updateData = {
        employee_code: newEmployee.employee_code.trim(),
        nick_name: newEmployee.nick_name.trim(),
        full_name: newEmployee.full_name.trim(),
        full_name_thai: newEmployee.full_name_thai?.trim() || null,
        department: newEmployee.department,
        start_date: newEmployee.start_date,
        bank_name: newEmployee.bank_name?.trim() || '미지정',
        bank_account: newEmployee.bank_account?.trim() || '미지정',
        monthly_salary: Number(newEmployee.monthly_salary) || 0,
        social_insurance_rate: Number(newEmployee.social_insurance_rate) || 5,
        tax_rate: Number(newEmployee.tax_rate) || 10,
        performance_rating: Number(newEmployee.performance_rating) || 3,
        status: newEmployee.status || 'ACTIVE',
        photo_url: newEmployee.photo_url || null,
        photo_filename: newEmployee.photo_filename || null,
        updated_at: new Date().toISOString()
      };

      console.log('업데이트 데이터 준비 완료:', updateData);

      // 4. 데이터베이스 업데이트
      const { data, error } = await supabase
        .from('employees')
        .update(updateData)
        .eq('id', selectedEmployee.id)
        .select();

      if (error) {
        console.error('Supabase 업데이트 오류:', error);
        
        // 구체적인 오류 메시지 처리
        if (error.message.includes('duplicate key')) {
          throw new Error('중복된 직원코드입니다. 다른 코드를 사용해주세요.');
        } else if (error.message.includes('foreign key')) {
          throw new Error('참조 오류가 발생했습니다. 부서 정보를 확인해주세요.');
        } else if (error.message.includes('not null')) {
          throw new Error('필수 필드가 누락되었습니다. 모든 필수 항목을 입력해주세요.');
        } else {
          throw new Error(`데이터베이스 오류: ${error.message}`);
        }
      }

      console.log('업데이트 성공:', data);

      // 5. 성공 처리
      alert('✅ 직원 정보가 성공적으로 수정되었습니다!');
      
      // 모달 닫기 및 상태 초기화
      setShowEmployeeEditModal(false);
      setSelectedEmployee(null);
      setEditingEmployee(null);
      
      // 데이터 새로고침
      loadData();
      
    } catch (error) {
      console.error('직원 정보 수정 오류:', error);
      
      // 구체적인 오류 메시지 표시
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      
      alert(`❌ 직원 정보 수정 실패\n\n오류 내용: ${errorMessage}\n\n해결 방법:\n1. 모든 필수 필드를 입력했는지 확인\n2. 숫자 필드에 올바른 값을 입력했는지 확인\n3. 직원코드가 중복되지 않았는지 확인\n4. 다시 시도해보세요`);
    }
  };

  // Storage 버킷 존재 확인 함수
  const checkStorageBucket = async () => {
    try {
      // 직접 버킷 정보 조회 시도
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('employee-photos');
      if (bucketError) {
        console.error('버킷 조회 오류:', bucketError);
        // 버킷 목록으로 재확인
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        if (listError) {
          console.error('버킷 목록 조회 오류:', listError);
          return false;
        }
        const bucketExists = buckets?.some(bucket => bucket.name === 'employee-photos');
        console.log('Storage 버킷 확인 (목록):', {
          totalBuckets: buckets?.length,
          employeePhotosExists: bucketExists,
          bucketNames: buckets?.map(b => b.name)
        });
        return bucketExists;
      }
      console.log('Storage 버킷 확인 (직접):', bucketData);
      return true;
    } catch (error) {
      console.error('버킷 확인 중 오류:', error);
      return false;
    }
  };

  // 사진 업로드 전 버킷 확인
  const ensureStorageBucket = async () => {
    const bucketExists = await checkStorageBucket();
          if (!bucketExists) {
        console.error('employee-photos 버킷이 존재하지 않습니다.');
        throw new Error('Storage 버킷(employee-photos)이 존재하지 않습니다. Supabase 대시보드에서 Storage → New bucket → Name: employee-photos, Public bucket 체크 후 생성해주세요.');
      }
    return true;
  };

  // 안전한 파일명 생성 함수
  const createSafeFileName = (originalName: string, employeeId?: number) => {
    // 파일 확장자 추출
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    
    // 안전한 파일명 생성 (영문, 숫자, 언더스코어만 허용)
    const timestamp = Date.now();
    const safeName = `employee_${employeeId || timestamp}_${timestamp}.${extension}`;
    
    return safeName;
  };

  // 직원 사진 업로드 함수 (개선된 버전)
  const handleEmployeePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>, employeeId?: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 업로드 상태 초기화
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. 파일 검증
      console.log('파일 검증 시작:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // 파일 크기 검증 (5MB 이하)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('파일 크기는 5MB 이하여야 합니다.');
      }

      // 파일 타입 검증 (더 엄격한 검증)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('지원되는 이미지 형식: JPEG, PNG, GIF, WebP');
      }

      // 파일명 검증
      const fileName = file.name.toLowerCase();
      if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
        throw new Error('잘못된 파일명입니다.');
      }

      setUploadProgress(20);
      console.log('파일 검증 완료');

      // 2. Storage 버킷 확인 (건너뛰기)
      console.log('Storage 버킷 확인 건너뛰기 - 직접 업로드 시도');

      // 3. 안전한 파일명 생성
      const safeFileName = createSafeFileName(file.name, employeeId);
      const filePath = safeFileName;

      console.log('업로드 시작:', filePath);
      setUploadProgress(40);

      // 4. Supabase Storage에 업로드
              console.log('Storage 업로드 시도:', {
          bucket: 'employee-photos',
          filePath: filePath,
          fileSize: file.size,
          fileType: file.type
        });

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('employee-photos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false // 기존 파일 덮어쓰기 방지
          });

      if (uploadError) {
        console.error('Storage 업로드 오류:', uploadError);
        
        // 구체적인 오류 메시지 처리
        if (uploadError.message.includes('already exists')) {
          throw new Error('동일한 파일명이 이미 존재합니다. 다른 파일을 선택해주세요.');
        } else if (uploadError.message.includes('not found') || uploadError.message.includes('Bucket not found')) {
          throw new Error('Storage 버킷(employee-photos)을 찾을 수 없습니다. Supabase 대시보드에서 Storage → New bucket → Name: employee-photos, Public bucket 체크 후 생성해주세요.');
        } else if (uploadError.message.includes('permission') || uploadError.message.includes('Forbidden')) {
          throw new Error('파일 업로드 권한이 없습니다. Storage 권한을 확인해주세요.');
        } else if (uploadError.message.includes('Unauthorized')) {
          throw new Error('인증 오류가 발생했습니다. 다시 로그인해주세요.');
        } else {
          throw new Error(`업로드 오류: ${uploadError.message}`);
        }
      }

      setUploadProgress(70);
      console.log('Storage 업로드 성공');

              // 5. 공개 URL 가져오기
        const { data: urlData } = supabase.storage
          .from('employee-photos')
          .getPublicUrl(filePath);

      const photoUrl = urlData.publicUrl;

      if (!photoUrl) {
        throw new Error('파일 URL을 생성할 수 없습니다.');
      }

      setUploadProgress(85);
      console.log('공개 URL 생성 완료:', photoUrl);

      // 6. 데이터베이스 업데이트
      if (employeeId) {
        console.log('기존 직원 사진 업데이트:', employeeId);
        
        const { error: updateError } = await supabase
          .from('employees')
          .update({
            photo_url: photoUrl,
            photo_filename: safeFileName,
            updated_at: new Date().toISOString()
          })
          .eq('id', employeeId);

        if (updateError) {
          console.error('DB 업데이트 오류:', updateError);
          throw new Error(`데이터베이스 업데이트 오류: ${updateError.message}`);
        }

        setUploadProgress(100);
        console.log('직원 정보 업데이트 완료');
        
        // 성공 메시지
        alert('✅ 직원 사진이 성공적으로 업로드되었습니다!');
        loadData();
      } else {
        // 새 직원 등록 시 사진 URL 설정
        console.log('새 직원 사진 설정');
        
        setNewEmployee(prev => ({
          ...prev,
          photo_url: photoUrl,
          photo_filename: safeFileName
        }));

        setUploadProgress(100);
        console.log('새 직원 사진 설정 완료');
        
        // 성공 메시지
        alert('✅ 사진이 성공적으로 업로드되었습니다!\n\n이제 직원 정보를 입력하고 등록 버튼을 클릭하세요.');
        
        // 파일 입력 초기화
        if (event.target) {
          event.target.value = '';
        }

        // 디버깅: 현재 상태 확인
        console.log('사진 업로드 후 newEmployee 상태:', {
          photo_url: photoUrl,
          photo_filename: safeFileName,
          fullState: newEmployee
        });
      }

    } catch (error) {
      console.error('사진 업로드 오류:', error);
      
      // 구체적인 오류 메시지 표시
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      
      alert(`❌ 사진 업로드 실패\n\n오류 내용: ${errorMessage}\n\n해결 방법:\n1. 파일 크기가 5MB 이하인지 확인\n2. 이미지 파일인지 확인\n3. 인터넷 연결 상태 확인\n4. 다시 시도해보세요`);
      
    } finally {
      // 업로드 상태 초기화
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // 부서 관리 함수들
  const handleAddDepartment = async () => {
    if (!newDepartment.department_code || !newDepartment.department_name) {
      alert('부서 코드와 부서명을 입력해주세요.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('departments')
        .insert({
          department_code: newDepartment.department_code.toUpperCase(),
          department_name: newDepartment.department_name,
          department_description: newDepartment.department_description,
          budget: Number(newDepartment.budget) || 0,
          status: newDepartment.status
        })
        .select();

      if (error) {
        console.error('부서 추가 오류:', error);
        throw new Error(`데이터베이스 오류: ${error.message}`);
      }

      alert('부서가 성공적으로 추가되었습니다.');
      setShowDepartmentModal(false);
      setNewDepartment({
        department_code: '',
        department_name: '',
        department_description: '',
        budget: '',
        status: 'ACTIVE'
      });
      loadData();
    } catch (error) {
      console.error('부서 추가 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`부서 추가 중 오류가 발생했습니다.\n\n오류 내용: ${errorMessage}`);
    }
  };

  const handleEditDepartment = (department: any) => {
    setSelectedDepartment(department);
    setNewDepartment({
      department_code: department.department_code,
      department_name: department.department_name,
      department_description: department.department_description || '',
      budget: department.budget.toString(),
      status: department.status
    });
    setShowDepartmentModal(true);
  };

  const handleUpdateDepartment = async () => {
    if (!selectedDepartment) {
      alert('선택된 부서가 없습니다.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('departments')
        .update({
          department_code: newDepartment.department_code.toUpperCase(),
          department_name: newDepartment.department_name,
          department_description: newDepartment.department_description,
          budget: Number(newDepartment.budget) || 0,
          status: newDepartment.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedDepartment.id)
        .select();

      if (error) {
        console.error('부서 수정 오류:', error);
        throw new Error(`데이터베이스 오류: ${error.message}`);
      }

      alert('부서가 성공적으로 수정되었습니다.');
      setShowDepartmentModal(false);
      setSelectedDepartment(null);
      setNewDepartment({
        department_code: '',
        department_name: '',
        department_description: '',
        budget: '',
        status: 'ACTIVE'
      });
      loadData();
    } catch (error) {
      console.error('부서 수정 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`부서 수정 중 오류가 발생했습니다.\n\n오류 내용: ${errorMessage}`);
    }
  };

  const handleDeleteDepartment = async (departmentId: number) => {
    if (!confirm('정말로 이 부서를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', departmentId);

      if (error) {
        console.error('부서 삭제 오류:', error);
        throw new Error(`데이터베이스 오류: ${error.message}`);
      }

      alert('부서가 성공적으로 삭제되었습니다.');
      loadData();
    } catch (error) {
      console.error('부서 삭제 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`부서 삭제 중 오류가 발생했습니다.\n\n오류 내용: ${errorMessage}`);
    }
  };

  // 포인트 관리 함수들
  const handleAddPoint = async () => {
    if (!newPoint.employee_id || !newPoint.point_reason || !newPoint.point_amount) {
      alert('필수 필드를 입력해주세요.');
      return;
    }

    try {
      const pointAmount = newPoint.point_type === 'PENALTY' 
        ? -Math.abs(Number(newPoint.point_amount))
        : Math.abs(Number(newPoint.point_amount));

      const { data, error } = await supabase
        .from('point_records')
        .insert({
          employee_id: newPoint.employee_id,
          point_date: newPoint.point_date,
          point_type: newPoint.point_type,
          point_amount: pointAmount,
          point_reason: newPoint.point_reason,
          description: newPoint.description,
          category: newPoint.category,
          status: 'PENDING'
        })
        .select();

      if (error) {
        console.error('포인트 추가 오류:', error);
        throw new Error(`데이터베이스 오류: ${error.message}`);
      }

      alert('포인트가 성공적으로 추가되었습니다.');
      setShowPointModal(false);
      setNewPoint({
        employee_id: 0,
        point_date: '',
        point_type: 'BONUS',
        point_amount: '0',
        point_reason: '',
        description: '',
        category: 'PERFORMANCE'
      });
      loadData();
    } catch (error) {
      console.error('포인트 추가 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`포인트 추가 중 오류가 발생했습니다.\n\n오류 내용: ${errorMessage}`);
    }
  };

  const handlePointAction = async (pointId: number, action: 'APPROVE' | 'REJECT', reason?: string) => {
    try {
      const status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      const updateData: any = {
        status: status,
        updated_at: new Date().toISOString()
      };

      if (action === 'APPROVE') {
        updateData.approved_by = 1; // 관리자 ID (실제로는 로그인된 사용자 ID)
        updateData.approved_at = new Date().toISOString();
      } else if (action === 'REJECT') {
        updateData.rejection_reason = reason || '승인 거부됨';
      }

      const { error } = await supabase
        .from('point_records')
        .update(updateData)
        .eq('id', pointId);

      if (error) {
        console.error('포인트 상태 변경 오류:', error);
        throw new Error(`데이터베이스 오류: ${error.message}`);
      }

      alert(`포인트가 성공적으로 ${action === 'APPROVE' ? '승인' : '거부'}되었습니다.`);
      loadData();
    } catch (error) {
      console.error('포인트 상태 변경 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`포인트 상태 변경 중 오류가 발생했습니다.\n\n오류 내용: ${errorMessage}`);
    }
  };

  const handleViewPoint = (point: PointRecord) => {
    setSelectedPoint(point);
    setShowPointViewModal(true);
  };

  const handleEditPoint = (point: PointRecord) => {
    setSelectedPoint(point);
    setEditingPoint(point);
    setNewPoint({
      employee_id: point.employee_id,
      point_date: point.point_date,
      point_type: point.point_type,
      point_amount: Math.abs(point.point_amount).toString(),
      point_reason: point.point_reason,
      description: point.description || '',
      category: point.category
    });
    setShowPointEditModal(true);
  };

  const handleUpdatePoint = async () => {
    if (!selectedPoint) {
      alert('선택된 포인트가 없습니다.');
      return;
    }

    try {
      const pointAmount = newPoint.point_type === 'PENALTY' 
        ? -Math.abs(Number(newPoint.point_amount))
        : Math.abs(Number(newPoint.point_amount));

      const { data, error } = await supabase
        .from('point_records')
        .update({
          point_date: newPoint.point_date,
          point_type: newPoint.point_type,
          point_amount: pointAmount,
          point_reason: newPoint.point_reason,
          description: newPoint.description,
          category: newPoint.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPoint.id)
        .select();

      if (error) {
        console.error('포인트 수정 오류:', error);
        throw new Error(`데이터베이스 오류: ${error.message}`);
      }

      alert('포인트가 성공적으로 수정되었습니다.');
      setShowPointEditModal(false);
      setSelectedPoint(null);
      setEditingPoint(null);
      loadData();
    } catch (error) {
      console.error('포인트 수정 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`포인트 수정 중 오류가 발생했습니다.\n\n오류 내용: ${errorMessage}`);
    }
  };

  // 업로드 진행 상태 표시 컴포넌트
  const UploadProgress = ({ isVisible, progress }: { isVisible: boolean; progress: number }) => {
    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">파일 업로드 중...</h3>
            <p className="text-sm text-gray-600 mb-4">잠시만 기다려주세요.</p>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-500">{progress}% 완료</p>
          </div>
        </div>
      </div>
    );
  };

  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-pink-100 min-h-screen transition-all duration-300 fixed left-0 top-0 z-10`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {dashboardSettings.showLogo && dashboardSettings.logoUrl ? (
              <img 
                src={dashboardSettings.logoUrl} 
                alt="Dashboard Logo" 
                className={`w-8 h-8 rounded object-cover ${!sidebarOpen && 'hidden'}`}
              />
            ) : (
              <Building className="text-pink-600" size={24} />
            )}
            <h1 className={`text-black font-bold text-xl ml-2 ${!sidebarOpen && 'hidden'}`}>
              {dashboardSettings.logoText || '급여관리'}
          </h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-black hover:bg-pink-200 p-2 rounded"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      
      <nav className="mt-8">
        {[
          { id: 'dashboard', label: '대시보드', icon: Home },
          ...(canAccessPayroll() ? [{ id: 'payroll', label: '급여관리', icon: DollarSign }] : []),
          ...(canAccessOvertime() ? [{ id: 'overtime', label: '오버타임', icon: Clock }] : []),
          ...(canAccessPoints() ? [{ id: 'points', label: '인사고과', icon: Star }] : []),
          ...(canAccessEmployeeManagement() ? [{ id: 'employees', label: '직원관리', icon: Users }] : []),
          { id: 'reports', label: '보고서', icon: FileText },
          { id: 'settings', label: '설정', icon: Settings },
          ...(canAccessAdmin() ? [{ id: 'admin', label: '관리자', icon: Shield }] : [])
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-pink-200 transition-colors ${
                currentView === item.id ? 'bg-pink-200 border-r-4 border-pink-500' : ''
              }`}
            >
              <Icon className="text-black" size={20} />
              <span className={`text-black ml-3 ${!sidebarOpen && 'hidden'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 w-full p-4">
        <div className="mb-4">
          <label className={`block text-xs font-medium text-black mb-1 ${!sidebarOpen && 'hidden'}`}>
            현재 사용자 권한
          </label>
          <select
            value={currentUser.role}
            onChange={(e) => setCurrentUser({...currentUser, role: e.target.value as 'SUPER_ADMIN' | 'HR_ADMIN' | 'FINANCE_ADMIN'})}
            className={`w-full p-2 text-xs border border-pink-300 rounded bg-white text-black ${!sidebarOpen && 'hidden'}`}
          >
            <option value="SUPER_ADMIN">최고관리자</option>
            <option value="FINANCE_ADMIN">회계관리자</option>
            <option value="HR_ADMIN">인사관리자</option>
          </select>
        </div>
        <button className="w-full flex items-center px-4 py-3 text-left hover:bg-pink-200 transition-colors">
          <LogOut className="text-black" size={20} />
          <span className={`text-black ml-3 ${!sidebarOpen && 'hidden'}`}>
            로그아웃
          </span>
        </button>
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-pink-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-black mb-1">{title}</p>
          <p className="text-2xl font-semibold text-black">{value}</p>
          {trend && (
            <p className="text-sm text-pink-600 mt-1">
              <TrendingUp className="inline w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className="bg-pink-50 p-3 rounded-full">
          <Icon className="text-pink-600" size={24} />
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">대시보드</h2>
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-pink-500" />
          <span className="text-black">{selectedYear}년 {selectedMonth}</span>
          <button 
            onClick={generateDashboardReport}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center"
          >
            <FileText size={16} className="mr-2" />
            대시보드 리포트
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="총 직원수" 
          value={totalEmployees}
          icon={Users}
          trend="+2 from last month"
        />
        <StatCard 
          title="총 급여지급액" 
          value={`₩${totalGrossSalary.toLocaleString()}`}
          icon={DollarSign}
          trend="+5.2% from last month"
        />
        <StatCard 
          title="총 오버타임" 
          value={`${totalOvertimeHours}시간`}
          icon={Clock}
          trend="-12% from last month"
        />
        <StatCard 
          title="승인 대기" 
          value={pendingApprovals}
          icon={FileText}
          trend="2 pending"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">부서별 급여 현황</h3>
          <div className="space-y-4">
            {['IT', 'HR', 'Finance'].map(dept => {
              const deptData = payrollData.filter(emp => {
                const employee = emp.employees as any;
                return employee?.department === dept;
              });
              const deptTotal = deptData.reduce((sum, emp) => {
                const net = emp.base_salary + 
                           (emp.total_overtime_hours * emp.overtime_rate) + 
                           emp.performance_bonus + 
                           emp.special_bonus + 
                           emp.position_allowance + 
                           emp.meal_allowance + 
                           emp.transport_allowance - 
                           emp.social_insurance - 
                           emp.personal_tax - 
                           emp.advance_salary - 
                           emp.salary_deduction - 
                           emp.other_deductions;
                return sum + net;
              }, 0);
              const percentage = totalGrossSalary > 0 ? (deptTotal / totalGrossSalary * 100).toFixed(1) : '0';
              
              return (
                <div key={dept} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building size={16} className="text-gray-500 mr-2" />
                    <span className="font-medium">{dept}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₩{deptTotal.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">최근 오버타임 현황</h3>
          <div className="space-y-3">
            {overtimeData.slice(0, 5).map(ot => {
              const employee = ot.employees as any;
              return (
                <div key={ot.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <User size={16} className="text-gray-500 mr-2" />
                    <div>
                      <p className="font-medium text-sm">{employee?.nick_name}</p>
                      <p className="text-xs text-gray-500">{ot.overtime_date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{ot.overtime_hours}시간</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      ot.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      ot.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {ot.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const PayrollView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">급여 관리</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowPayrollModal(true)}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center"
          >
          <Plus size={20} className="mr-2" />
          새 급여명세서
        </button>
          <button 
            onClick={generatePayrollReport}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 flex items-center"
          >
            <FileText size={16} className="mr-2" />
            급여 리포트
        </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-pink-200">
        <div className="p-6 border-b border-pink-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                <input
                  type="text"
                  placeholder="직원 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-pink-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <button className="flex items-center px-4 py-2 border border-pink-300 rounded-lg hover:bg-pink-50">
                <Filter size={16} className="mr-2" />
                필터
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-pink-300 rounded-lg px-3 py-2"
              >
                <option value="JANUARY">1월</option>
                <option value="FEBRUARY">2월</option>
                <option value="MARCH">3월</option>
                <option value="APRIL">4월</option>
                <option value="MAY">5월</option>
                <option value="JUNE">6월</option>
                <option value="JULY">7월</option>
                <option value="AUGUST">8월</option>
                <option value="SEPTEMBER">9월</option>
                <option value="OCTOBER">10월</option>
                <option value="NOVEMBER">11월</option>
                <option value="DECEMBER">12월</option>
              </select>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">직원</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">부서</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">기본급</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">오버타임</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">보너스</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">총 급여</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">공제</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">실수령액</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayrollData.map(emp => {
                const employee = emp.employees as any;
                const grossSalary = emp.base_salary + 
                                   (emp.total_overtime_hours * emp.overtime_rate) + 
                                   emp.performance_bonus + 
                                   emp.special_bonus + 
                                   emp.position_allowance + 
                                   emp.meal_allowance + 
                                   emp.transport_allowance;
                const totalDeductions = emp.social_insurance + 
                                       emp.personal_tax + 
                                       emp.advance_salary + 
                                       emp.salary_deduction + 
                                       emp.other_deductions;
                const netSalary = grossSalary - totalDeductions;

                return (
                  <tr key={emp.id} className="hover:bg-pink-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-pink-600">
                              {employee?.nick_name?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-black">{employee?.nick_name}</div>
                          <div className="text-sm text-black">{employee?.employee_code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{employee?.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">₩{emp.base_salary.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {emp.total_overtime_hours}시간 (₩{(emp.total_overtime_hours * emp.overtime_rate).toLocaleString()})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      ₩{(emp.performance_bonus + emp.special_bonus).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">₩{grossSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">₩{totalDeductions.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-pink-600">₩{netSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        emp.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        emp.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        emp.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewPayroll(emp)}
                          className="text-pink-600 hover:text-pink-900"
                          title="보기"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            const payrollData = {
                              employee: emp.employees,
                              payroll: emp,
                              company: companySettings
                            };
                            const encodedData = encodeURIComponent(JSON.stringify(payrollData));
                            window.open(`/payroll_template.html?data=${encodedData}`, '_blank');
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="급여명세서 템플릿"
                        >
                          📄
                        </button>
                        <button 
                          onClick={() => handleEditPayroll(emp)}
                          className="text-pink-500 hover:text-pink-700"
                          title="수정"
                        >
                          <Edit size={16} />
                        </button>
                        {emp.status === 'DRAFT' && (
                          <button 
                            onClick={() => handlePayrollStatusChange(emp.id, 'APPROVED')}
                            className="text-green-600 hover:text-green-800"
                            title="승인"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        {emp.status === 'APPROVED' && (
                          <button 
                            onClick={() => handlePayrollStatusChange(emp.id, 'DRAFT')}
                            className="text-gray-600 hover:text-gray-800"
                            title="초안으로 변경"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const OvertimeView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">오버타임 관리</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowOvertimeModal(true)}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center"
          >
          <Plus size={20} className="mr-2" />
          오버타임 등록
        </button>
          <button 
            onClick={generateOvertimeReport}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 flex items-center"
          >
            <FileText size={16} className="mr-2" />
            오버타임 리포트
        </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-pink-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">직원</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">날짜</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">시간</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">업무 내용</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">우선순위</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {overtimeData.map(ot => {
                const employee = ot.employees as any;
                return (
                  <tr key={ot.id} className="hover:bg-pink-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-pink-600">
                              {employee?.nick_name?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-black">{employee?.nick_name}</div>
                          <div className="text-sm text-black">{employee?.employee_code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{ot.overtime_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {ot.start_time} - {ot.end_time} ({ot.overtime_hours}시간)
                    </td>
                    <td className="px-6 py-4 text-sm text-black">{ot.work_description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        ot.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        ot.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ot.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        ot.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        ot.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {ot.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewOvertime(ot)}
                          className="text-pink-600 hover:text-pink-900"
                          title="보기"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditOvertime(ot)}
                          className="text-pink-500 hover:text-pink-700"
                          title="수정"
                        >
                          <Edit size={16} />
                        </button>
                        {ot.status === 'PENDING' && (
                          <>
                          <button 
                            onClick={() => handleOvertimeAction(ot.id, 'APPROVE')}
                            className="text-green-600 hover:text-green-900"
                              title="승인"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => handleOvertimeAction(ot.id, 'REJECT')}
                            className="text-red-600 hover:text-red-900"
                              title="거부"
                          >
                            <X size={16} />
                          </button>
                          </>
                        )}
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PointsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">인사고과 관리</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowPointModal(true)}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center"
          >
            <Plus size={20} className="mr-2" />
            포인트 등록
          </button>
          <button 
            onClick={generatePointReport}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 flex items-center"
          >
            <FileText size={16} className="mr-2" />
            포인트 리포트
          </button>
        </div>
      </div>

      {/* 포인트 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-pink-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Award className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">총 포인트</p>
              <p className="text-2xl font-semibold text-black">
                {pointSummary.reduce((sum, emp) => sum + emp.total_points, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-pink-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Star className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">가산점</p>
              <p className="text-2xl font-semibold text-black">
                {pointSummary.reduce((sum, emp) => sum + emp.bonus_points, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-pink-200">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <Minus className="text-red-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">감점</p>
              <p className="text-2xl font-semibold text-black">
                {pointSummary.reduce((sum, emp) => sum + emp.penalty_points, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-pink-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">평가 대상</p>
              <p className="text-2xl font-semibold text-black">{pointSummary.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 포인트 요약 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border border-pink-200">
        <div className="p-6 border-b border-pink-200">
          <h3 className="text-lg font-semibold text-black">직원별 포인트 요약</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">직원</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">부서</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">총 포인트</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">가산점</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">감점</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">평가 횟수</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pointSummary.map(emp => (
                <tr key={emp.employee_id} className="hover:bg-pink-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-pink-600">
                            {emp.nick_name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-black">{emp.nick_name}</div>
                        <div className="text-sm text-black">{emp.employee_code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{emp.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    <span className={`font-semibold ${
                      emp.total_points > 0 ? 'text-green-600' : 
                      emp.total_points < 0 ? 'text-red-600' : 'text-black'
                    }`}>
                      {emp.total_points > 0 ? '+' : ''}{emp.total_points}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                    +{emp.bonus_points}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                    -{emp.penalty_points}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{emp.total_records}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 포인트 상세 기록 */}
      <div className="bg-white rounded-lg shadow-sm border border-pink-200">
        <div className="p-6 border-b border-pink-200">
          <h3 className="text-lg font-semibold text-black">포인트 상세 기록</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">직원</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">날짜</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">유형</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">포인트</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">사유</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">카테고리</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pointData.map(point => {
                const employee = point.employees as any;
                return (
                  <tr key={point.id} className="hover:bg-pink-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-pink-600">
                              {employee?.nick_name?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-black">{employee?.nick_name}</div>
                          <div className="text-sm text-black">{employee?.employee_code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{point.point_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        point.point_type === 'BONUS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {point.point_type === 'BONUS' ? '가산점' : '감점'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      <span className={`font-semibold ${
                        point.point_amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {point.point_amount > 0 ? '+' : ''}{point.point_amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-black">{point.point_reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{point.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        point.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        point.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {point.status === 'APPROVED' ? '승인' : 
                         point.status === 'PENDING' ? '대기' : '거부'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewPoint(point)}
                          className="text-pink-600 hover:text-pink-900"
                          title="보기"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditPoint(point)}
                          className="text-pink-500 hover:text-pink-700"
                          title="수정"
                        >
                          <Edit size={16} />
                        </button>
                        {point.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handlePointAction(point.id, 'APPROVE')}
                              className="text-green-600 hover:text-green-900"
                              title="승인"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => handlePointAction(point.id, 'REJECT')}
                              className="text-red-600 hover:text-red-900"
                              title="거부"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const EmployeesView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">직원 관리</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowEmployeeModal(true)}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center"
          >
          <Plus size={20} className="mr-2" />
          새 직원 등록
        </button>
          <button 
            onClick={generateEmployeeReport}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 flex items-center"
          >
            <FileText size={16} className="mr-2" />
            직원 리포트
        </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-pink-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">직원</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">부서</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">입사일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">월급</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">성과평가</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-pink-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {emp.photo_url ? (
                          <div className="relative">
                            <img 
                              src={emp.photo_url} 
                              alt={`${emp.nick_name} 사진`}
                              className="h-12 w-12 rounded-full object-cover border-2 border-pink-200"
                              onError={(e) => {
                                console.error('직원 목록 이미지 로드 실패:', emp.photo_url);
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center border-2 border-pink-200 hidden">
                              <span className="text-sm font-medium text-pink-600">
                            {emp.nick_name.charAt(0)}
                          </span>
                        </div>
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-pink-600">
                              {emp.nick_name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-black">{emp.nick_name}</div>
                        <div className="text-sm text-black">{emp.employee_code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{emp.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{emp.start_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">₩{emp.monthly_salary.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{emp.performance_rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      emp.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      emp.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewEmployee(emp)}
                        className="text-pink-600 hover:text-pink-900"
                        title="보기"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditEmployee(emp)}
                        className="text-pink-500 hover:text-pink-700"
                        title="수정"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">설정</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center"
          >
            <Settings size={20} className="mr-2" />
            회사 정보 편집
          </button>
          <button 
            onClick={() => setShowDashboardSettingsModal(true)}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 flex items-center"
          >
            <Layout size={20} className="mr-2" />
            대시보드 설정
          </button>
          <button 
            onClick={() => {
              setSelectedDepartment(null);
              setNewDepartment({
                department_code: '',
                department_name: '',
                department_description: '',
                budget: '',
                status: 'ACTIVE'
              });
              setShowDepartmentModal(true);
            }}
            className="bg-pink-400 text-white px-4 py-2 rounded-lg hover:bg-pink-500 flex items-center"
          >
            <Building size={20} className="mr-2" />
            부서 관리
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-pink-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">회사 정보</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">회사명</label>
              <p className="text-black">{companySettings?.company_name || '설정되지 않음'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">주소</label>
              <p className="text-black">{companySettings?.address || '설정되지 않음'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">전화번호</label>
              <p className="text-black">{companySettings?.phone || '설정되지 않음'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">이메일</label>
              <p className="text-black">{companySettings?.email || '설정되지 않음'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">웹사이트</label>
              <p className="text-black">{companySettings?.website || '설정되지 않음'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-pink-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">로고</h3>
          <div className="space-y-4">
            {dashboardSettings.logoUrl ? (
              <div>
                <img 
                  src={dashboardSettings.logoUrl} 
                  alt="Dashboard Logo" 
                  className="w-32 h-32 object-contain border border-pink-200 rounded-lg"
                />
                <p className="text-sm text-black mt-2">현재 로고</p>
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-pink-300 rounded-lg flex items-center justify-center">
                <p className="text-sm text-black">로고 없음</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-pink-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">대시보드 설정</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">기본 화면</label>
              <p className="text-black">{dashboardSettings.defaultView === 'dashboard' ? '대시보드' : '직원관리'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">테마</label>
              <p className="text-black">{dashboardSettings.theme === 'light' ? '라이트' : '다크'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">언어</label>
              <p className="text-black">{dashboardSettings.language === 'ko' ? '한국어' : 'English'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">통화</label>
              <p className="text-black">{dashboardSettings.currency === 'KRW' ? '원화 (₩)' : '달러 ($)'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">자동 새로고침</label>
              <p className="text-black">{dashboardSettings.refreshInterval}초</p>
            </div>
          </div>
        </div>
      </div>

      {/* 부서 목록 */}
      <div className="bg-white rounded-lg shadow-sm border border-pink-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">부서 목록</h3>
          <button 
            onClick={() => {
              setSelectedDepartment(null);
              setNewDepartment({
                department_code: '',
                department_name: '',
                department_description: '',
                budget: '',
                status: 'ACTIVE'
              });
              setShowDepartmentModal(true);
            }}
            className="bg-pink-600 text-white px-3 py-1 rounded-lg hover:bg-pink-700 flex items-center text-sm"
          >
            <Plus size={16} className="mr-1" />
            새 부서 추가
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">부서 코드</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">부서명</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">설명</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">예산</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">상태</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-pink-200">
              {departments.map(dept => (
                <tr key={dept.id} className="hover:bg-pink-50">
                  <td className="px-4 py-2 text-sm text-black font-medium">{dept.department_code}</td>
                  <td className="px-4 py-2 text-sm text-black">{dept.department_name}</td>
                  <td className="px-4 py-2 text-sm text-black">{dept.department_description || '-'}</td>
                  <td className="px-4 py-2 text-sm text-black">₩{dept.budget?.toLocaleString() || '0'}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      dept.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {dept.status === 'ACTIVE' ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditDepartment(dept)}
                        className="text-pink-600 hover:text-pink-900"
                        title="수정"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteDepartment(dept.id)}
                        className="text-red-600 hover:text-red-900"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ReportsView = () => {
    const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

    const generatePayrollReport = (employeeId?: number) => {
      const targetData = employeeId 
        ? payrollData.filter(emp => emp.employee_id === employeeId)
        : payrollData;

      let reportContent = `
        급여명세서 보고서
        ====================
        생성일: ${new Date().toLocaleDateString()}
        기간: ${selectedYear}년 ${selectedMonth}
        
      `;

      targetData.forEach(emp => {
        const employee = emp.employees as any;
        const grossSalary = emp.base_salary + 
                          (emp.total_overtime_hours * emp.overtime_rate) + 
                          emp.performance_bonus + 
                          emp.special_bonus + 
                          emp.position_allowance + 
                          emp.meal_allowance + 
                          emp.transport_allowance;
        const netSalary = grossSalary - emp.social_insurance - emp.personal_tax - emp.advance_salary - emp.salary_deduction - emp.other_deductions;

        reportContent += `
        직원: ${employee?.nick_name} (${employee?.employee_code})
        부서: ${employee?.department}
        기본급: ฿${emp.base_salary.toLocaleString()}
        성과보너스: ฿${emp.performance_bonus.toLocaleString()}
        특별보너스: ฿${emp.special_bonus.toLocaleString()}
        오버타임: ${emp.total_overtime_hours}시간 (฿${(emp.total_overtime_hours * emp.overtime_rate).toLocaleString()})
        총 급여: ฿${grossSalary.toLocaleString()}
        실수령액: ฿${netSalary.toLocaleString()}
        상태: ${emp.status}
        ----------------------------------------
        `;
      });

      // 새 창에서 보고서 출력
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>급여명세서 보고서</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .content { white-space: pre-line; font-family: monospace; }
                .footer { margin-top: 30px; text-align: center; }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>급여명세서 보고서</h1>
                <p>${selectedYear}년 ${selectedMonth}</p>
              </div>
              <div class="content">${reportContent}</div>
              <div class="footer">
                <p>생성일: ${new Date().toLocaleDateString()}</p>
                <button class="no-print" onclick="window.print()">인쇄</button>
                <button class="no-print" onclick="window.close()">닫기</button>
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    };

    const generateOvertimeReport = () => {
      let reportContent = `
        오버타임 보고서
        ====================
        생성일: ${new Date().toLocaleDateString()}
        기간: ${selectedYear}년 ${selectedMonth}
        
      `;

      overtimeData.forEach(item => {
        const employee = item.employees as any;
        reportContent += `
        직원: ${employee?.nick_name} (${employee?.employee_code})
        날짜: ${new Date(item.overtime_date).toLocaleDateString()}
        시간: ${item.start_time} - ${item.end_time} (${item.overtime_hours}시간)
        작업: ${item.work_description}
        상태: ${item.status}
        ----------------------------------------
        `;
      });

      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>오버타임 보고서</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .content { white-space: pre-line; font-family: monospace; }
                .footer { margin-top: 30px; text-align: center; }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>오버타임 보고서</h1>
                <p>${selectedYear}년 ${selectedMonth}</p>
              </div>
              <div class="content">${reportContent}</div>
              <div class="footer">
                <p>생성일: ${new Date().toLocaleDateString()}</p>
                <button class="no-print" onclick="window.print()">인쇄</button>
                <button class="no-print" onclick="window.close()">닫기</button>
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-black">보고서</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 급여명세서 보고서 */}
          <div className="bg-white rounded-lg shadow-sm border border-pink-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-black">급여명세서 보고서</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <select
                  className="flex-1 border border-pink-300 rounded px-3 py-2 text-sm text-black"
                  value={selectedEmployee || ''}
                  onChange={(e) => setSelectedEmployee(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">전체 직원</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nick_name} ({emp.employee_code})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => generatePayrollReport(selectedEmployee || undefined)}
                className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                급여명세서 생성
              </button>
            </div>
          </div>

          {/* 오버타임 보고서 */}
          <div className="bg-white rounded-lg shadow-sm border border-pink-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-black">오버타임 보고서</h3>
            <div className="space-y-4">
              <p className="text-sm text-black">
                {selectedYear}년 {selectedMonth} 오버타임 현황을 포함한 보고서를 생성합니다.
              </p>
              <button
                onClick={generateOvertimeReport}
                className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                오버타임 보고서 생성
              </button>
            </div>
          </div>
        </div>

        {/* 보고서 통계 */}
        <div className="bg-white rounded-lg shadow-sm border border-pink-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">보고서 통계</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="text-2xl font-bold text-pink-600">{payrollData.length}</p>
              <p className="text-sm text-black">급여명세서</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="text-2xl font-bold text-pink-600">{overtimeData.length}</p>
              <p className="text-sm text-black">오버타임 기록</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="text-2xl font-bold text-pink-600">
                ฿{payrollData.reduce((sum, emp) => sum + emp.base_salary, 0).toLocaleString()}
              </p>
              <p className="text-sm text-black">총 기본급</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="text-2xl font-bold text-pink-600">
                {payrollData.reduce((sum, emp) => sum + emp.total_overtime_hours, 0)}시간
              </p>
              <p className="text-sm text-black">총 오버타임</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AdminView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">관리자</h2>
        <button 
          onClick={() => setShowAdminModal(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          관리자 추가
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 사용자 관리 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-pink-200">
            <div className="p-6 border-b border-pink-200">
              <h3 className="text-lg font-semibold text-black">사용자 관리</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-pink-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">사용자</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">역할</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">상태</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">액션</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-pink-200">
                  {adminUsers.map(user => (
                    <tr key={user.id} className="hover:bg-pink-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-black">{user.name}</div>
                          <div className="text-sm text-black">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' :
                          user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role === 'SUPER_ADMIN' ? '최고관리자' :
                           user.role === 'MANAGER' ? '매니저' : '인사팀'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'ACTIVE' ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`text-sm px-2 py-1 rounded ${
                              user.status === 'ACTIVE' 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {user.status === 'ACTIVE' ? '비활성화' : '활성화'}
                          </button>
                          <button 
                            onClick={() => handleDeleteAdminUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 시스템 정보 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-pink-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-black">시스템 정보</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-black">버전</label>
                <p className="text-black">v1.0.0</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">데이터베이스</label>
                <p className="text-black">Supabase</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">마지막 업데이트</label>
                <p className="text-black">{new Date().toLocaleDateString('ko-KR')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-pink-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-black">권한 관리</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">급여 관리</span>
                <span className="text-pink-600 text-sm">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">직원 관리</span>
                <span className="text-pink-600 text-sm">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">오버타임 관리</span>
                <span className="text-pink-600 text-sm">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">설정 관리</span>
                <span className="text-pink-600 text-sm">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-black">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <Sidebar />
      
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <main className="p-8">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'payroll' && canAccessPayroll() && <PayrollView />}
          {currentView === 'overtime' && canAccessOvertime() && <OvertimeView />}
          {currentView === 'points' && canAccessPoints() && <PointsView />}
          {currentView === 'employees' && canAccessEmployeeManagement() && <EmployeesView />}
          {currentView === 'admin' && canAccessAdmin() && <AdminView />}
          {currentView === 'reports' && <ReportsView />}
          {currentView === 'settings' && <SettingsView />}
          
          {/* 권한 없음 메시지 */}
          {currentView === 'payroll' && !canAccessPayroll() && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-red-600 mb-4">접근 권한이 없습니다</h2>
              <p className="text-gray-600">급여관리는 최고관리자와 회계관리자만 접근할 수 있습니다.</p>
            </div>
          )}
          {currentView === 'overtime' && !canAccessOvertime() && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-red-600 mb-4">접근 권한이 없습니다</h2>
              <p className="text-gray-600">오버타임 관리는 최고관리자와 인사관리자만 접근할 수 있습니다.</p>
            </div>
          )}
          {currentView === 'points' && !canAccessPoints() && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-red-600 mb-4">접근 권한이 없습니다</h2>
              <p className="text-gray-600">인사고과는 최고관리자와 인사관리자만 접근할 수 있습니다.</p>
            </div>
          )}
          {currentView === 'employees' && !canAccessEmployeeManagement() && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-red-600 mb-4">접근 권한이 없습니다</h2>
              <p className="text-gray-600">직원관리는 최고관리자와 인사관리자만 접근할 수 있습니다.</p>
            </div>
          )}
          {currentView === 'admin' && !canAccessAdmin() && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-red-600 mb-4">접근 권한이 없습니다</h2>
              <p className="text-gray-600">관리자 메뉴는 최고관리자만 접근할 수 있습니다.</p>
            </div>
          )}
        </main>
      </div>

      {/* 급여명세서 모달 */}
      {showPayrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900">새 급여명세서 생성</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">직원 선택</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPayroll.employee_id}
                  onChange={(e) => setNewPayroll({...newPayroll, employee_id: Number(e.target.value)})}
                >
                  <option value={0}>직원을 선택하세요</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nick_name} ({emp.employee_code})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">기본급</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPayroll.base_salary}
                  onChange={(e) => setNewPayroll({...newPayroll, base_salary: e.target.value})}
                  onFocus={handleNumberFocus}
                  onBlur={handleNumberBlur}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">성과보너스</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPayroll.performance_bonus}
                  onChange={(e) => setNewPayroll({...newPayroll, performance_bonus: e.target.value})}
                  onFocus={handleNumberFocus}
                  onBlur={handleNumberBlur}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">특별보너스</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPayroll.special_bonus}
                  onChange={(e) => setNewPayroll({...newPayroll, special_bonus: e.target.value})}
                  onFocus={handleNumberFocus}
                  onBlur={handleNumberBlur}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">직책수당</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPayroll.position_allowance}
                  onChange={(e) => setNewPayroll({...newPayroll, position_allowance: e.target.value})}
                  onFocus={handleNumberFocus}
                  onBlur={handleNumberBlur}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">식대</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPayroll.meal_allowance}
                  onChange={(e) => setNewPayroll({...newPayroll, meal_allowance: e.target.value})}
                  onFocus={handleNumberFocus}
                  onBlur={handleNumberBlur}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">교통비</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPayroll.transport_allowance}
                  onChange={(e) => setNewPayroll({...newPayroll, transport_allowance: e.target.value})}
                  onFocus={handleNumberFocus}
                  onBlur={handleNumberBlur}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사회보험</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPayroll.social_insurance}
                  onChange={(e) => setNewPayroll({...newPayroll, social_insurance: e.target.value})}
                  onFocus={handleNumberFocus}
                  onBlur={handleNumberBlur}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">소득세</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPayroll.personal_tax}
                  onChange={(e) => setNewPayroll({...newPayroll, personal_tax: e.target.value})}
                  onFocus={handleNumberFocus}
                  onBlur={handleNumberBlur}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">선지급금</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPayroll.advance_salary}
                  onChange={(e) => setNewPayroll({...newPayroll, advance_salary: e.target.value})}
                  onFocus={handleNumberFocus}
                  onBlur={handleNumberBlur}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">기타공제</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPayroll.other_deductions}
                  onChange={(e) => setNewPayroll({...newPayroll, other_deductions: e.target.value})}
                  onFocus={handleNumberFocus}
                  onBlur={handleNumberBlur}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddPayroll}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                생성
              </button>
              <button
                onClick={() => setShowPayrollModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 직원 등록 모달 */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900">새 직원 등록</h2>
            
            {/* 사진 업로드 섹션 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">직원 사진</label>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {newEmployee.photo_url ? (
                    <img 
                      src={newEmployee.photo_url} 
                      alt="직원 사진 미리보기"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Camera size={32} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">사진 없음</p>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleEmployeePhotoUpload(e)}
                    className="hidden"
                    id="employee-photo-upload"
                  />
                  <label
                    htmlFor="employee-photo-upload"
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 cursor-pointer flex items-center"
                  >
                    <Upload size={16} className="mr-2" />
                    사진 업로드
                  </label>
                  <p className="text-xs text-gray-500 mt-1">5MB 이하, 이미지 파일만</p>
                  {newEmployee.photo_url && (
                    <div className="mt-2">
                      <p className="text-xs text-green-600 mb-1">✅ 사진이 업로드되었습니다</p>
                      <button
                        onClick={() => {
                          setNewEmployee(prev => ({
                            ...prev,
                            photo_url: '',
                            photo_filename: ''
                          }));
                          alert('사진이 삭제되었습니다.');
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        사진 삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  직원 코드 * 
                  <span className="text-xs text-gray-500 ml-1">(영문자, 숫자만)</span>
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded text-gray-900 ${
                    newEmployee.employee_code && !/^[A-Za-z0-9]+$/.test(newEmployee.employee_code)
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  value={newEmployee.employee_code}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setNewEmployee({...newEmployee, employee_code: value});
                  }}
                  placeholder="예: EMP001"
                  maxLength={10}
                />
                {newEmployee.employee_code && !/^[A-Za-z0-9]+$/.test(newEmployee.employee_code) && (
                  <p className="text-xs text-red-600 mt-1">영문자와 숫자만 입력 가능합니다.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임 * 
                  <span className="text-xs text-gray-500 ml-1">(필수)</span>
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded text-gray-900 ${
                    newEmployee.nick_name === '' ? 'border-gray-300' : 
                    newEmployee.nick_name.trim() === '' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'
                  }`}
                  value={newEmployee.nick_name}
                  onChange={(e) => setNewEmployee({...newEmployee, nick_name: e.target.value})}
                  placeholder="예: 김철수"
                  maxLength={50}
                />
                {newEmployee.nick_name.trim() === '' && newEmployee.nick_name !== '' && (
                  <p className="text-xs text-red-600 mt-1">닉네임을 입력해주세요.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전체 이름 * 
                  <span className="text-xs text-gray-500 ml-1">(필수)</span>
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded text-gray-900 ${
                    newEmployee.full_name === '' ? 'border-gray-300' : 
                    newEmployee.full_name.trim() === '' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'
                  }`}
                  value={newEmployee.full_name}
                  onChange={(e) => setNewEmployee({...newEmployee, full_name: e.target.value})}
                  placeholder="예: 김철수"
                  maxLength={100}
                />
                {newEmployee.full_name.trim() === '' && newEmployee.full_name !== '' && (
                  <p className="text-xs text-red-600 mt-1">전체 이름을 입력해주세요.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">태국어 이름</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newEmployee.full_name_thai}
                  onChange={(e) => setNewEmployee({...newEmployee, full_name_thai: e.target.value})}
                  placeholder="예: Kim Chul Soo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">부서</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                >
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">입사일</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newEmployee.start_date}
                  onChange={(e) => setNewEmployee({...newEmployee, start_date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  월급 
                  <span className="text-xs text-gray-500 ml-1">(0 이상)</span>
                </label>
                <input
                  type="number"
                  className={`w-full p-2 border rounded text-gray-900 ${
                    Number(newEmployee.monthly_salary) < 0 ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  value={newEmployee.monthly_salary}
                  onChange={(e) => setNewEmployee({...newEmployee, monthly_salary: e.target.value})}
                  onFocus={handleNumberFocus}
                  onBlur={handleNumberBlur}
                  placeholder="예: 30000"
                  min="0"
                  step="1000"
                />
                {Number(newEmployee.monthly_salary) < 0 && (
                  <p className="text-xs text-red-600 mt-1">월급은 0 이상이어야 합니다.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사회보험률 (%)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newEmployee.social_insurance_rate}
                  onChange={(e) => setNewEmployee({...newEmployee, social_insurance_rate: e.target.value})}
                  onFocus={handleNumberFocus}
                  onBlur={handleNumberBlur}
                  placeholder="예: 5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">세율 (%)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newEmployee.tax_rate}
                  onChange={(e) => setNewEmployee({...newEmployee, tax_rate: e.target.value})}
                  onFocus={handleNumberFocus}
                  onBlur={handleNumberBlur}
                  placeholder="예: 10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">성과평가</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newEmployee.performance_rating}
                  onChange={(e) => setNewEmployee({...newEmployee, performance_rating: Number(e.target.value)})}
                >
                  <option value={1}>1 (낮음)</option>
                  <option value={2}>2 (보통)</option>
                  <option value={3}>3 (양호)</option>
                  <option value={4}>4 (우수)</option>
                  <option value={5}>5 (최우수)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newEmployee.status}
                  onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value as any})}
                >
                  <option value="ACTIVE">활성</option>
                  <option value="INACTIVE">비활성</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddEmployee}
                disabled={isUploading}
                className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${
                  isUploading 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    등록 중...
                  </>
                ) : (
                  '등록'
                )}
              </button>
              <button
                onClick={() => setShowEmployeeModal(false)}
                disabled={isUploading}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  isUploading 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 오버타임 등록 모달 */}
      {showOvertimeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">오버타임 등록</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">직원 선택</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newOvertime.employee_id}
                  onChange={(e) => setNewOvertime({...newOvertime, employee_id: Number(e.target.value)})}
                >
                  <option value={0}>직원을 선택하세요</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nick_name} ({emp.employee_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newOvertime.overtime_date}
                  onChange={(e) => setNewOvertime({...newOvertime, overtime_date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시작 시간</label>
                <input
                  type="time"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newOvertime.start_time}
                  onChange={(e) => setNewOvertime({...newOvertime, start_time: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">종료 시간</label>
                <input
                  type="time"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newOvertime.end_time}
                  onChange={(e) => setNewOvertime({...newOvertime, end_time: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">업무 내용</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  rows={3}
                  value={newOvertime.work_description}
                  onChange={(e) => setNewOvertime({...newOvertime, work_description: e.target.value})}
                  placeholder="오버타임 업무 내용을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사유</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newOvertime.reason}
                  onChange={(e) => setNewOvertime({...newOvertime, reason: e.target.value as any})}
                >
                  <option value="PROJECT_DEADLINE">프로젝트 마감</option>
                  <option value="URGENT_TASK">긴급 업무</option>
                  <option value="SYSTEM_MAINTENANCE">시스템 유지보수</option>
                  <option value="MEETING">회의</option>
                  <option value="OTHER">기타</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newOvertime.priority}
                  onChange={(e) => setNewOvertime({...newOvertime, priority: e.target.value as any})}
                >
                  <option value="LOW">낮음</option>
                  <option value="MEDIUM">보통</option>
                  <option value="HIGH">높음</option>
                  <option value="URGENT">긴급</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddOvertime}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                등록
              </button>
              <button
                onClick={() => setShowOvertimeModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 설정 모달 */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900">회사 설정</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">로고 업로드</h3>
                <div className="space-y-4">
                  {companySettings?.logo_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">현재 로고</label>
                      <img 
                        src={companySettings.logo_url} 
                        alt="Current Logo" 
                        className="w-32 h-32 object-contain border border-gray-300 rounded"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">새 로고 업로드</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    />
                    <p className="text-sm text-gray-500 mt-1">5MB 이하의 이미지 파일만 업로드 가능합니다.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">회사 정보</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">회사명</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newSettings.company_name}
                      onChange={(e) => setNewSettings({...newSettings, company_name: e.target.value})}
                      placeholder="회사명을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      rows={3}
                      value={newSettings.address}
                      onChange={(e) => setNewSettings({...newSettings, address: e.target.value})}
                      placeholder="회사 주소를 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newSettings.phone}
                      onChange={(e) => setNewSettings({...newSettings, phone: e.target.value})}
                      placeholder="전화번호를 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newSettings.email}
                      onChange={(e) => setNewSettings({...newSettings, email: e.target.value})}
                      placeholder="이메일을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">웹사이트</label>
                    <input
                      type="url"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newSettings.website}
                      onChange={(e) => setNewSettings({...newSettings, website: e.target.value})}
                      placeholder="웹사이트 URL을 입력하세요"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSaveSettings}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                저장
              </button>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 대시보드 설정 모달 */}
      {showDashboardSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-black">대시보드 설정</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black">기본 설정</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">기본 화면</label>
                    <select
                      className="w-full p-2 border border-pink-300 rounded text-black"
                      value={dashboardSettings.defaultView}
                      onChange={(e) => setDashboardSettings({...dashboardSettings, defaultView: e.target.value})}
                    >
                      <option value="dashboard">대시보드</option>
                      <option value="employees">직원관리</option>
                      <option value="payroll">급여관리</option>
                      <option value="overtime">오버타임</option>
                      <option value="points">포인트</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">테마</label>
                    <select
                      className="w-full p-2 border border-pink-300 rounded text-black"
                      value={dashboardSettings.theme}
                      onChange={(e) => setDashboardSettings({...dashboardSettings, theme: e.target.value})}
                    >
                      <option value="light">라이트</option>
                      <option value="dark">다크</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">언어</label>
                    <select
                      className="w-full p-2 border border-pink-300 rounded text-black"
                      value={dashboardSettings.language}
                      onChange={(e) => setDashboardSettings({...dashboardSettings, language: e.target.value})}
                    >
                      <option value="ko">한국어</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">통화</label>
                    <select
                      className="w-full p-2 border border-pink-300 rounded text-black"
                      value={dashboardSettings.currency}
                      onChange={(e) => setDashboardSettings({...dashboardSettings, currency: e.target.value})}
                    >
                      <option value="KRW">원화 (₩)</option>
                      <option value="USD">달러 ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">자동 새로고침 (초)</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-pink-300 rounded text-black"
                      value={dashboardSettings.refreshInterval}
                      onChange={(e) => setDashboardSettings({...dashboardSettings, refreshInterval: parseInt(e.target.value) || 300})}
                      min="60"
                      max="3600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-black">화면 표시 설정</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-black">환영 메시지 표시</label>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                      checked={dashboardSettings.showWelcomeMessage}
                      onChange={(e) => setDashboardSettings({...dashboardSettings, showWelcomeMessage: e.target.checked})}
                    />
                  </div>

                  {dashboardSettings.showWelcomeMessage && (
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">환영 메시지</label>
                      <textarea
                        className="w-full p-2 border border-pink-300 rounded text-black"
                        rows={3}
                        value={dashboardSettings.welcomeMessage}
                        onChange={(e) => setDashboardSettings({...dashboardSettings, welcomeMessage: e.target.value})}
                        placeholder="환영 메시지를 입력하세요"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-black">알림 표시</label>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                      checked={dashboardSettings.showNotifications}
                      onChange={(e) => setDashboardSettings({...dashboardSettings, showNotifications: e.target.checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-black">빠른 작업 버튼</label>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                      checked={dashboardSettings.showQuickActions}
                      onChange={(e) => setDashboardSettings({...dashboardSettings, showQuickActions: e.target.checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-black">최근 활동</label>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                      checked={dashboardSettings.showRecentActivity}
                      onChange={(e) => setDashboardSettings({...dashboardSettings, showRecentActivity: e.target.checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-black">통계 차트</label>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                      checked={dashboardSettings.showStatistics}
                      onChange={(e) => setDashboardSettings({...dashboardSettings, showStatistics: e.target.checked})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 로고 설정 섹션 */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-black">로고 설정</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-black">로고 표시</label>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                      checked={dashboardSettings.showLogo}
                      onChange={(e) => setDashboardSettings({...dashboardSettings, showLogo: e.target.checked})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">로고 텍스트</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-pink-300 rounded text-black"
                      value={dashboardSettings.logoText}
                      onChange={(e) => setDashboardSettings({...dashboardSettings, logoText: e.target.value})}
                      placeholder="로고 텍스트를 입력하세요"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">로고 이미지</label>
                  <div className="border-2 border-dashed border-pink-300 rounded-lg p-4 text-center">
                    {dashboardSettings.logoUrl ? (
                      <div className="space-y-2">
                        <img 
                          src={dashboardSettings.logoUrl} 
                          alt="Dashboard Logo" 
                          className="w-16 h-16 mx-auto object-cover rounded"
                        />
                        <button
                          onClick={async () => {
                            try {
                              // 데이터베이스에서 로고 URL 제거
                              const { error } = await supabase
                                .from('dashboard_settings')
                                .update({ logo_url: '', logo_filename: '' })
                                .eq('id', 1);
                              
                              if (error) {
                                console.error('로고 제거 오류:', error);
                                alert('로고 제거 중 오류가 발생했습니다.');
                                return;
                              }
                              
                              // 로컬 상태 업데이트
                              setDashboardSettings({...dashboardSettings, logoUrl: ''});
                              alert('로고가 제거되었습니다.');
                            } catch (error) {
                              console.error('로고 제거 오류:', error);
                              alert('로고 제거 중 오류가 발생했습니다.');
                            }
                          }}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          로고 제거
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 mx-auto text-pink-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">로고 이미지를 업로드하세요</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleDashboardLogoUpload}
                          className="hidden"
                          id="dashboard-logo-upload"
                        />
                        <label
                          htmlFor="dashboard-logo-upload"
                          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 cursor-pointer text-sm"
                        >
                          이미지 선택
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSaveDashboardSettings}
                className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700"
              >
                저장
              </button>
              <button
                onClick={() => setShowDashboardSettingsModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 관리자 모달 */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900">관리자 추가</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사용자명</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newAdminUser.username}
                  onChange={(e) => setNewAdminUser({...newAdminUser, username: e.target.value})}
                  placeholder="사용자명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newAdminUser.name}
                  onChange={(e) => setNewAdminUser({...newAdminUser, name: e.target.value})}
                  placeholder="이름을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newAdminUser.email}
                  onChange={(e) => setNewAdminUser({...newAdminUser, email: e.target.value})}
                  placeholder="이메일을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">역할</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newAdminUser.role}
                  onChange={(e) => setNewAdminUser({...newAdminUser, role: e.target.value})}
                >
                  <option value="HR">인사팀</option>
                  <option value="MANAGER">매니저</option>
                  <option value="SUPER_ADMIN">최고관리자</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newAdminUser.password}
                  onChange={(e) => setNewAdminUser({...newAdminUser, password: e.target.value})}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddAdminUser}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                추가
              </button>
              <button
                onClick={() => setShowAdminModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 급여 보기 모달 */}
      {showPayrollViewModal && selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900">급여명세서 상세보기</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">기본 정보</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">직원명</label>
                      <p className="text-gray-900">{(selectedPayroll.employees as any)?.nick_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">부서</label>
                      <p className="text-gray-900">{(selectedPayroll.employees as any)?.department}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">급여년도</label>
                      <p className="text-gray-900">{selectedPayroll.pay_year}년</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">급여월</label>
                      <p className="text-gray-900">{selectedPayroll.pay_month}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">지급일</label>
                      <p className="text-gray-900">{selectedPayroll.payment_date}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">상태</label>
                      <p className="text-gray-900">{selectedPayroll.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 급여 상세 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">급여 상세</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">기본급</span>
                      <span className="font-medium">₩{selectedPayroll.base_salary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">오버타임</span>
                      <span className="font-medium">₩{(selectedPayroll.total_overtime_hours * selectedPayroll.overtime_rate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">성과보너스</span>
                      <span className="font-medium">₩{selectedPayroll.performance_bonus.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">특별보너스</span>
                      <span className="font-medium">₩{selectedPayroll.special_bonus.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">직책수당</span>
                      <span className="font-medium">₩{selectedPayroll.position_allowance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">식대</span>
                      <span className="font-medium">₩{selectedPayroll.meal_allowance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">교통비</span>
                      <span className="font-medium">₩{selectedPayroll.transport_allowance.toLocaleString()}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>총 지급액</span>
                      <span className="text-blue-600">₩{(selectedPayroll.base_salary + 
                        (selectedPayroll.total_overtime_hours * selectedPayroll.overtime_rate) + 
                        selectedPayroll.performance_bonus + 
                        selectedPayroll.special_bonus + 
                        selectedPayroll.position_allowance + 
                        selectedPayroll.meal_allowance + 
                        selectedPayroll.transport_allowance).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 공제 내역 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">공제 내역</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">사회보험</span>
                      <span className="font-medium">₩{selectedPayroll.social_insurance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">소득세</span>
                      <span className="font-medium">₩{selectedPayroll.personal_tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">선지급금</span>
                      <span className="font-medium">₩{selectedPayroll.advance_salary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">급여공제</span>
                      <span className="font-medium">₩{selectedPayroll.salary_deduction.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">기타공제</span>
                      <span className="font-medium">₩{selectedPayroll.other_deductions.toLocaleString()}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>총 공제액</span>
                      <span className="text-red-600">₩{(selectedPayroll.social_insurance + 
                        selectedPayroll.personal_tax + 
                        selectedPayroll.advance_salary + 
                        selectedPayroll.salary_deduction + 
                        selectedPayroll.other_deductions).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 실수령액 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">실수령액</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      ₩{(selectedPayroll.base_salary + 
                        (selectedPayroll.total_overtime_hours * selectedPayroll.overtime_rate) + 
                        selectedPayroll.performance_bonus + 
                        selectedPayroll.special_bonus + 
                        selectedPayroll.position_allowance + 
                        selectedPayroll.meal_allowance + 
                        selectedPayroll.transport_allowance - 
                        selectedPayroll.social_insurance - 
                        selectedPayroll.personal_tax - 
                        selectedPayroll.advance_salary - 
                        selectedPayroll.salary_deduction - 
                        selectedPayroll.other_deductions).toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">최종 실수령액</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowPayrollViewModal(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 급여 수정 모달 */}
      {showPayrollEditModal && selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900">급여명세서 수정</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 기본급 및 보너스 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">기본급 및 보너스</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기본급</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newPayroll.base_salary}
                      onChange={(e) => setNewPayroll({...newPayroll, base_salary: e.target.value})}
                      onFocus={handleNumberFocus}
                      onBlur={handleNumberBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">성과보너스</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newPayroll.performance_bonus}
                      onChange={(e) => setNewPayroll({...newPayroll, performance_bonus: e.target.value})}
                      onFocus={handleNumberFocus}
                      onBlur={handleNumberBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">특별보너스</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newPayroll.special_bonus}
                      onChange={(e) => setNewPayroll({...newPayroll, special_bonus: e.target.value})}
                      onFocus={handleNumberFocus}
                      onBlur={handleNumberBlur}
                    />
                  </div>
                </div>
              </div>

              {/* 수당 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">수당</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">직책수당</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newPayroll.position_allowance}
                      onChange={(e) => setNewPayroll({...newPayroll, position_allowance: e.target.value})}
                      onFocus={handleNumberFocus}
                      onBlur={handleNumberBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">식대</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newPayroll.meal_allowance}
                      onChange={(e) => setNewPayroll({...newPayroll, meal_allowance: e.target.value})}
                      onFocus={handleNumberFocus}
                      onBlur={handleNumberBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">교통비</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newPayroll.transport_allowance}
                      onChange={(e) => setNewPayroll({...newPayroll, transport_allowance: e.target.value})}
                      onFocus={handleNumberFocus}
                      onBlur={handleNumberBlur}
                    />
                  </div>
                </div>
              </div>

              {/* 공제 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">공제</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사회보험</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newPayroll.social_insurance}
                      onChange={(e) => setNewPayroll({...newPayroll, social_insurance: e.target.value})}
                      onFocus={handleNumberFocus}
                      onBlur={handleNumberBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">소득세</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newPayroll.personal_tax}
                      onChange={(e) => setNewPayroll({...newPayroll, personal_tax: e.target.value})}
                      onFocus={handleNumberFocus}
                      onBlur={handleNumberBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">선지급금</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newPayroll.advance_salary}
                      onChange={(e) => setNewPayroll({...newPayroll, advance_salary: e.target.value})}
                      onFocus={handleNumberFocus}
                      onBlur={handleNumberBlur}
                    />
                  </div>
                </div>
              </div>

              {/* 기타 공제 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">기타 공제</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">급여공제</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newPayroll.salary_deduction}
                      onChange={(e) => setNewPayroll({...newPayroll, salary_deduction: e.target.value})}
                      onFocus={handleNumberFocus}
                      onBlur={handleNumberBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기타공제</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newPayroll.other_deductions}
                      onChange={(e) => setNewPayroll({...newPayroll, other_deductions: e.target.value})}
                      onFocus={handleNumberFocus}
                      onBlur={handleNumberBlur}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdatePayroll}
                className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700"
              >
                수정 완료
              </button>
              <button
                onClick={() => setShowPayrollEditModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 오버타임 보기 모달 */}
      {showOvertimeViewModal && selectedOvertime && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">오버타임 상세보기</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">기본 정보</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">직원명</label>
                      <p className="text-gray-900">{(selectedOvertime.employees as any)?.nick_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">직원 코드</label>
                      <p className="text-gray-900">{(selectedOvertime.employees as any)?.employee_code}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">오버타임 날짜</label>
                      <p className="text-gray-900">{selectedOvertime.overtime_date}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">상태</label>
                      <p className="text-gray-900">{selectedOvertime.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 시간 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">시간 정보</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">시작 시간</label>
                      <p className="text-gray-900">{selectedOvertime.start_time}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">종료 시간</label>
                      <p className="text-gray-900">{selectedOvertime.end_time}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">총 시간</label>
                      <p className="text-gray-900">{selectedOvertime.overtime_hours}시간</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">우선순위</label>
                      <p className="text-gray-900">{selectedOvertime.priority}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 업무 내용 */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">업무 내용</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">업무 설명</label>
                    <p className="text-gray-900">{selectedOvertime.work_description}</p>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">사유</label>
                    <p className="text-gray-900">{selectedOvertime.reason}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowOvertimeViewModal(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 오버타임 수정 모달 */}
      {showOvertimeEditModal && selectedOvertime && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">오버타임 수정</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">오버타임 날짜</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newOvertime.overtime_date}
                  onChange={(e) => setNewOvertime({...newOvertime, overtime_date: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">시작 시간</label>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    value={newOvertime.start_time}
                    onChange={(e) => setNewOvertime({...newOvertime, start_time: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">종료 시간</label>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    value={newOvertime.end_time}
                    onChange={(e) => setNewOvertime({...newOvertime, end_time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">업무 설명</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  rows={3}
                  value={newOvertime.work_description}
                  onChange={(e) => setNewOvertime({...newOvertime, work_description: e.target.value})}
                  placeholder="업무 내용을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사유</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newOvertime.reason}
                  onChange={(e) => setNewOvertime({...newOvertime, reason: e.target.value})}
                >
                  <option value="PROJECT">프로젝트</option>
                  <option value="EMERGENCY">긴급 업무</option>
                  <option value="DEADLINE">마감</option>
                  <option value="OTHER">기타</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newOvertime.priority}
                  onChange={(e) => setNewOvertime({...newOvertime, priority: e.target.value})}
                >
                  <option value="LOW">낮음</option>
                  <option value="MEDIUM">보통</option>
                  <option value="HIGH">높음</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdateOvertime}
                className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700"
              >
                수정 완료
              </button>
              <button
                onClick={() => setShowOvertimeEditModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 직원 보기 모달 */}
      {showEmployeeViewModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900">직원 상세보기</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 사진 및 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">사진</h3>
                <div className="flex justify-center">
                  {selectedEmployee.photo_url ? (
                    <div className="text-center">
                      <img 
                        src={selectedEmployee.photo_url} 
                        alt={`${selectedEmployee.nick_name} 사진`}
                        className="w-48 h-48 rounded-lg object-cover border-4 border-pink-200"
                        onError={(e) => {
                          console.error('이미지 로드 실패:', selectedEmployee.photo_url);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="w-48 h-48 rounded-lg bg-red-100 flex items-center justify-center border-4 border-red-200 hidden">
                        <div className="text-center">
                          <Camera size={48} className="text-red-400 mx-auto mb-2" />
                          <p className="text-red-600">이미지 로드 실패</p>
                          <p className="text-xs text-red-500 mt-1">URL: {selectedEmployee.photo_url}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-48 h-48 rounded-lg bg-pink-100 flex items-center justify-center border-4 border-pink-200">
                      <div className="text-center">
                        <Camera size={48} className="text-pink-400 mx-auto mb-2" />
                        <p className="text-pink-600">사진 없음</p>
                        <p className="text-xs text-gray-500 mt-1">photo_url: {selectedEmployee.photo_url || 'null'}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">기본 정보</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">직원 코드</label>
                      <p className="text-gray-900">{selectedEmployee.employee_code}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">닉네임</label>
                      <p className="text-gray-900">{selectedEmployee.nick_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">전체 이름</label>
                      <p className="text-gray-900">{selectedEmployee.full_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">태국어 이름</label>
                      <p className="text-gray-900">{selectedEmployee.full_name_thai}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">부서</label>
                      <p className="text-gray-900">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">입사일</label>
                      <p className="text-gray-900">{selectedEmployee.start_date}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">상태</label>
                      <p className="text-gray-900">{selectedEmployee.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 급여 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">급여 정보</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">월급</label>
                      <p className="text-gray-900">₩{selectedEmployee.monthly_salary.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">시급</label>
                      <p className="text-gray-900">₩{selectedEmployee.hourly_rate.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">오버타임 시급</label>
                      <p className="text-gray-900">₩{selectedEmployee.overtime_rate.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">성과평가</label>
                      <p className="text-gray-900">{selectedEmployee.performance_rating}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 은행 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">은행 정보</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">은행명</label>
                      <p className="text-gray-900">{selectedEmployee.bank_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">계좌번호</label>
                      <p className="text-gray-900">{selectedEmployee.bank_account}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 세금 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">세금 정보</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">사회보험률</label>
                      <p className="text-gray-900">{selectedEmployee.social_insurance_rate}%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">세율</label>
                      <p className="text-gray-900">{selectedEmployee.tax_rate}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowEmployeeViewModal(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 직원 수정 모달 */}
      {showEmployeeEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900">직원 정보 수정</h2>
            
            {/* 사진 업로드 섹션 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">직원 사진</label>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {newEmployee.photo_url ? (
                    <img 
                      src={newEmployee.photo_url} 
                      alt="직원 사진 미리보기"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Camera size={32} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">사진 없음</p>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleEmployeePhotoUpload(e, selectedEmployee.id)}
                    className="hidden"
                    id="employee-photo-upload-edit"
                  />
                  <label
                    htmlFor="employee-photo-upload-edit"
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 cursor-pointer flex items-center"
                  >
                    <Upload size={16} className="mr-2" />
                    사진 업로드
                  </label>
                  <p className="text-xs text-gray-500 mt-1">5MB 이하, 이미지 파일만</p>
                  {newEmployee.photo_url && (
                    <button
                      onClick={async () => {
                        try {
                          // 데이터베이스에서 사진 정보 삭제
                          const { error } = await supabase
                            .from('employees')
                            .update({
                              photo_url: null,
                              photo_filename: null,
                              updated_at: new Date().toISOString()
                            })
                            .eq('id', selectedEmployee.id);

                          if (error) {
                            console.error('사진 삭제 오류:', error);
                            throw new Error(`데이터베이스 오류: ${error.message}`);
                          }

                          // 로컬 상태 업데이트
                          setNewEmployee(prev => ({
                            ...prev,
                            photo_url: '',
                            photo_filename: ''
                          }));

                          alert('사진이 삭제되었습니다.');
                          loadData();
                        } catch (error) {
                          console.error('사진 삭제 오류:', error);
                          const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
                          alert(`사진 삭제 중 오류가 발생했습니다.\n\n오류 내용: ${errorMessage}`);
                        }
                      }}
                      className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      사진 삭제
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">기본 정보</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">직원 코드</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newEmployee.employee_code}
                      onChange={(e) => setNewEmployee({...newEmployee, employee_code: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newEmployee.nick_name}
                      onChange={(e) => setNewEmployee({...newEmployee, nick_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">전체 이름</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newEmployee.full_name}
                      onChange={(e) => setNewEmployee({...newEmployee, full_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">태국어 이름</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newEmployee.full_name_thai}
                      onChange={(e) => setNewEmployee({...newEmployee, full_name_thai: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* 부서 및 입사일 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">부서 및 입사일</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">부서</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    >
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">입사일</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newEmployee.start_date}
                      onChange={(e) => setNewEmployee({...newEmployee, start_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newEmployee.status}
                      onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value})}
                    >
                      <option value="ACTIVE">활성</option>
                      <option value="INACTIVE">비활성</option>
                      <option value="TERMINATED">퇴사</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 급여 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">급여 정보</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">월급</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newEmployee.monthly_salary}
                      onChange={(e) => setNewEmployee({...newEmployee, monthly_salary: e.target.value})}
                      onFocus={handleNumberFocus}
                      onBlur={handleNumberBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">성과평가</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newEmployee.performance_rating}
                      onChange={(e) => setNewEmployee({...newEmployee, performance_rating: Number(e.target.value)})}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 은행 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">은행 정보</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">은행명</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newEmployee.bank_name}
                      onChange={(e) => setNewEmployee({...newEmployee, bank_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">계좌번호</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newEmployee.bank_account}
                      onChange={(e) => setNewEmployee({...newEmployee, bank_account: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* 세금 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">세금 정보</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사회보험률 (%)</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newEmployee.social_insurance_rate}
                      onChange={(e) => setNewEmployee({...newEmployee, social_insurance_rate: e.target.value})}
                      onFocus={handleNumberFocus}
                      onBlur={handleNumberBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">세율 (%)</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      value={newEmployee.tax_rate}
                      onChange={(e) => setNewEmployee({...newEmployee, tax_rate: e.target.value})}
                      onFocus={handleNumberFocus}
                      onBlur={handleNumberBlur}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdateEmployee}
                className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700"
              >
                수정 완료
              </button>
              <button
                onClick={() => setShowEmployeeEditModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 부서 관리 모달 */}
      {showDepartmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {selectedDepartment ? '부서 수정' : '새 부서 추가'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">부서 코드 *</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newDepartment.department_code}
                  onChange={(e) => setNewDepartment({...newDepartment, department_code: e.target.value})}
                  placeholder="예: IT"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">부서명 *</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newDepartment.department_name}
                  onChange={(e) => setNewDepartment({...newDepartment, department_name: e.target.value})}
                  placeholder="예: 정보기술팀"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newDepartment.department_description}
                  onChange={(e) => setNewDepartment({...newDepartment, department_description: e.target.value})}
                  placeholder="부서에 대한 설명을 입력하세요"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">예산</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newDepartment.budget}
                  onChange={(e) => setNewDepartment({...newDepartment, budget: e.target.value})}
                  placeholder="예: 1000000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newDepartment.status}
                  onChange={(e) => setNewDepartment({...newDepartment, status: e.target.value})}
                >
                  <option value="ACTIVE">활성</option>
                  <option value="INACTIVE">비활성</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={selectedDepartment ? handleUpdateDepartment : handleAddDepartment}
                className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700"
              >
                {selectedDepartment ? '수정 완료' : '추가 완료'}
              </button>
              <button
                onClick={() => setShowDepartmentModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 포인트 등록 모달 */}
      {showPointModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900">포인트 등록</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">직원 *</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPoint.employee_id}
                  onChange={(e) => setNewPoint({...newPoint, employee_id: Number(e.target.value)})}
                >
                  <option value={0}>직원을 선택하세요</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nick_name} ({emp.employee_code}) - {emp.department}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">날짜 *</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPoint.point_date}
                  onChange={(e) => setNewPoint({...newPoint, point_date: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">포인트 유형 *</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPoint.point_type}
                  onChange={(e) => setNewPoint({...newPoint, point_type: e.target.value as 'BONUS' | 'PENALTY'})}
                >
                  <option value="BONUS">가산점</option>
                  <option value="PENALTY">감점</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">포인트 *</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPoint.point_amount}
                  onChange={(e) => setNewPoint({...newPoint, point_amount: e.target.value})}
                  onFocus={handleNumberFocus}
                  onBlur={handleNumberBlur}
                  placeholder="예: 10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사유 *</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPoint.point_reason}
                  onChange={(e) => setNewPoint({...newPoint, point_reason: e.target.value})}
                  placeholder="예: 프로젝트 완료"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 *</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPoint.category}
                  onChange={(e) => setNewPoint({...newPoint, category: e.target.value as any})}
                >
                  <option value="PERFORMANCE">업무 성과</option>
                  <option value="ATTENDANCE">출근/근태</option>
                  <option value="TEAMWORK">팀워크/협력</option>
                  <option value="INNOVATION">혁신/아이디어</option>
                  <option value="OTHER">기타</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상세 설명</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPoint.description}
                  onChange={(e) => setNewPoint({...newPoint, description: e.target.value})}
                  placeholder="상세한 설명을 입력하세요"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddPoint}
                className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700"
              >
                등록 완료
              </button>
              <button
                onClick={() => setShowPointModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 포인트 보기 모달 */}
      {showPointViewModal && selectedPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">포인트 상세보기</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">직원</label>
                  <p className="text-gray-900">
                    {(selectedPoint.employees as any)?.nick_name} ({(selectedPoint.employees as any)?.employee_code})
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
                  <p className="text-gray-900">{selectedPoint.point_date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">포인트 유형</label>
                  <p className="text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedPoint.point_type === 'BONUS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedPoint.point_type === 'BONUS' ? '가산점' : '감점'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">포인트</label>
                  <p className={`text-gray-900 font-semibold ${
                    selectedPoint.point_amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedPoint.point_amount > 0 ? '+' : ''}{selectedPoint.point_amount}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                  <p className="text-gray-900">{selectedPoint.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                  <p className="text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedPoint.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      selectedPoint.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedPoint.status === 'APPROVED' ? '승인' : 
                       selectedPoint.status === 'PENDING' ? '대기' : '거부'}
                    </span>
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사유</label>
                <p className="text-gray-900">{selectedPoint.point_reason}</p>
              </div>
              
              {selectedPoint.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">상세 설명</label>
                  <p className="text-gray-900">{selectedPoint.description}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPointViewModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 포인트 수정 모달 */}
      {showPointEditModal && selectedPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900">포인트 수정</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">직원</label>
                <p className="text-gray-900 p-2 bg-gray-50 rounded">
                  {(selectedPoint.employees as any)?.nick_name} ({(selectedPoint.employees as any)?.employee_code})
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">날짜 *</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPoint.point_date}
                  onChange={(e) => setNewPoint({...newPoint, point_date: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">포인트 유형 *</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPoint.point_type}
                  onChange={(e) => setNewPoint({...newPoint, point_type: e.target.value as 'BONUS' | 'PENALTY'})}
                >
                  <option value="BONUS">가산점</option>
                  <option value="PENALTY">감점</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">포인트 *</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPoint.point_amount}
                  onChange={(e) => setNewPoint({...newPoint, point_amount: e.target.value})}
                  onFocus={handleNumberFocus}
                  onBlur={handleNumberBlur}
                  placeholder="예: 10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사유 *</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPoint.point_reason}
                  onChange={(e) => setNewPoint({...newPoint, point_reason: e.target.value})}
                  placeholder="예: 프로젝트 완료"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 *</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPoint.category}
                  onChange={(e) => setNewPoint({...newPoint, category: e.target.value as any})}
                >
                  <option value="PERFORMANCE">업무 성과</option>
                  <option value="ATTENDANCE">출근/근태</option>
                  <option value="TEAMWORK">팀워크/협력</option>
                  <option value="INNOVATION">혁신/아이디어</option>
                  <option value="OTHER">기타</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상세 설명</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={newPoint.description}
                  onChange={(e) => setNewPoint({...newPoint, description: e.target.value})}
                  placeholder="상세한 설명을 입력하세요"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdatePoint}
                className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700"
              >
                수정 완료
              </button>
              <button
                onClick={() => setShowPointEditModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
          <button 
            onClick={() => setLoading(false)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            계속하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      
      {/* 업로드 진행 상태 표시 */}
      <UploadProgress isVisible={isUploading} progress={uploadProgress} />
      
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <main className="p-8">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'payroll' && <PayrollView />}
          {currentView === 'overtime' && <OvertimeView />}
          {currentView === 'points' && <PointsView />}
          {currentView === 'employees' && <EmployeesView />}
          {currentView === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">보고서</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">대시보드 리포트</h3>
                  <p className="text-gray-600 mb-4">현재 월의 대시보드 통계를 포함한 종합 리포트</p>
                  <button 
                    onClick={generateDashboardReport}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    리포트 생성
                  </button>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">급여 리포트</h3>
                  <p className="text-gray-600 mb-4">선택된 월의 급여명세서 상세 리포트</p>
                  <button 
                    onClick={generatePayrollReport}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                  >
                    리포트 생성
                  </button>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">오버타임 리포트</h3>
                  <p className="text-gray-600 mb-4">선택된 월의 오버타임 기록 리포트</p>
                  <button 
                    onClick={generateOvertimeReport}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                  >
                    리포트 생성
                  </button>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">직원 리포트</h3>
                  <p className="text-gray-600 mb-4">전체 직원 정보 및 현황 리포트</p>
                  <button 
                    onClick={generateEmployeeReport}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700"
                  >
                    리포트 생성
                  </button>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">인사고과 리포트</h3>
                  <p className="text-gray-600 mb-4">포인트 기록 및 인사고과 리포트</p>
                  <button 
                    onClick={generatePointReport}
                    className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700"
                  >
                    리포트 생성
                  </button>
                </div>
              </div>
            </div>
          )}
          {currentView === 'settings' && <SettingsView />}
          {currentView === 'admin' && <AdminView />}
        </main>
      </div>
    </div>
  );
};

export default PayrollDashboard; 