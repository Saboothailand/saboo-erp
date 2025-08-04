'use client'

import React, { useState } from 'react';
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
  Settings
} from 'lucide-react';

const TestDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 테스트용 샘플 데이터
  const testEmployees = [
    { id: 1, employee_code: 'EMP001', nick_name: 'ICE', full_name: '아이스 김', department: 'IT', monthly_salary: 25000 },
    { id: 2, employee_code: 'EMP002', nick_name: 'JOHN', full_name: '존 리', department: 'HR', monthly_salary: 22000 },
    { id: 3, employee_code: 'EMP003', nick_name: 'MARY', full_name: '메리 박', department: 'Finance', monthly_salary: 28000 },
    { id: 4, employee_code: 'EMP004', nick_name: 'TOM', full_name: '톰 최', department: 'IT', monthly_salary: 23000 },
    { id: 5, employee_code: 'EMP005', nick_name: 'LISA', full_name: '리사 정', department: 'Marketing', monthly_salary: 24000 }
  ];

  const testPayroll = [
    { id: 1, employee_code: 'EMP001', nick_name: 'ICE', department: 'IT', base_salary: 25000, performance_bonus: 1500, special_bonus: 2000, total_overtime_hours: 2.5, status: 'APPROVED' },
    { id: 2, employee_code: 'EMP002', nick_name: 'JOHN', department: 'HR', base_salary: 22000, performance_bonus: 1200, special_bonus: 0, total_overtime_hours: 1.5, status: 'DRAFT' },
    { id: 3, employee_code: 'EMP003', nick_name: 'MARY', department: 'Finance', base_salary: 28000, performance_bonus: 1800, special_bonus: 2500, total_overtime_hours: 3.0, status: 'APPROVED' },
    { id: 4, employee_code: 'EMP004', nick_name: 'TOM', department: 'IT', base_salary: 23000, performance_bonus: 1000, special_bonus: 0, total_overtime_hours: 1.0, status: 'PENDING' },
    { id: 5, employee_code: 'EMP005', nick_name: 'LISA', department: 'Marketing', base_salary: 24000, performance_bonus: 1300, special_bonus: 0, total_overtime_hours: 2.0, status: 'APPROVED' }
  ];

  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 min-h-screen transition-all duration-300 fixed left-0 top-0 z-10`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1 className={`text-white font-bold text-xl ${!sidebarOpen && 'hidden'}`}>
            💼 급여관리
          </h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-gray-800 p-2 rounded"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      
      <nav className="mt-8">
        {[
          { id: 'dashboard', label: '대시보드', icon: Home },
          { id: 'payroll', label: '급여관리', icon: DollarSign },
          { id: 'overtime', label: '오버타임', icon: Clock },
          { id: 'employees', label: '직원관리', icon: Users },
          { id: 'reports', label: '보고서', icon: FileText },
          { id: 'settings', label: '설정', icon: Settings }
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-800 transition-colors ${
                currentView === item.id ? 'bg-gray-800 border-r-4 border-blue-500' : ''
              }`}
            >
              <Icon className="text-white" size={20} />
              <span className={`text-white ml-3 ${!sidebarOpen && 'hidden'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 w-full p-4">
        <button className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-800 transition-colors">
          <LogOut className="text-white" size={20} />
          <span className={`text-white ml-3 ${!sidebarOpen && 'hidden'}`}>
            로그아웃
          </span>
        </button>
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">
              <TrendingUp className="inline w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-100 rounded-full">
          <Icon className="text-blue-600" size={24} />
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
        <p className="text-gray-600">2025년 7월 급여 현황</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="총 직원수" 
          value={testEmployees.length} 
          icon={Users} 
          trend="+1명"
        />
        <StatCard 
          title="총 급여지급액" 
          value="฿125,000" 
          icon={DollarSign} 
          trend="+5.2%"
        />
        <StatCard 
          title="총 오버타임" 
          value="10시간" 
          icon={Clock} 
          trend="+2.5시간"
        />
        <StatCard 
          title="승인 대기" 
          value="1건" 
          icon={Eye} 
          trend="-2건"
        />
      </div>

      {/* 부서별 급여 현황 */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">부서별 급여 현황</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['IT', 'HR', 'Finance', 'Marketing'].map(dept => {
            const deptEmployees = testEmployees.filter(emp => emp.department === dept);
            const totalSalary = deptEmployees.reduce((sum, emp) => sum + emp.monthly_salary, 0);
            return (
              <div key={dept} className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">{dept}</h3>
                <p className="text-2xl font-bold text-blue-600">฿{totalSalary.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{deptEmployees.length}명</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 최근 오버타임 현황 */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">최근 오버타임 현황</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직원</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부서</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">오버타임</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testPayroll.slice(0, 3).map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.nick_name}</div>
                        <div className="text-sm text-gray-500">{item.employee_code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.total_overtime_hours}시간
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status === 'APPROVED' ? '승인됨' :
                       item.status === 'PENDING' ? '대기중' : '초안'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PayrollView = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">급여 관리</h1>
        <p className="text-gray-600">2025년 7월 급여명세서</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="직원명, 부서, 직원코드로 검색..."
                className="border-0 focus:ring-0 text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={20} />
              <select className="border-0 focus:ring-0 text-sm">
                <option>전체 부서</option>
                <option>IT</option>
                <option>HR</option>
                <option>Finance</option>
                <option>Marketing</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직원</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부서</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기본급</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">성과보너스</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">특별보너스</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">오버타임</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testPayroll.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.nick_name}</div>
                        <div className="text-sm text-gray-500">{item.employee_code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ฿{item.base_salary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ฿{item.performance_bonus.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ฿{item.special_bonus.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.total_overtime_hours}시간
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status === 'APPROVED' ? '승인됨' :
                       item.status === 'PENDING' ? '대기중' : '초안'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
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

  const EmployeesView = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">직원 관리</h1>
        <p className="text-gray-600">전체 직원 목록</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="직원명, 부서, 직원코드로 검색..."
                className="border-0 focus:ring-0 text-sm"
              />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus size={16} />
              <span>새 직원 추가</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직원</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부서</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">월급</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">입사일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.nick_name}</div>
                        <div className="text-sm text-gray-500">{employee.full_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {employee.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ฿{employee.monthly_salary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2024-01-15
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      재직중
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <div className="min-h-screen">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'payroll' && <PayrollView />}
          {currentView === 'employees' && <EmployeesView />}
          {currentView === 'overtime' && (
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">오버타임 관리</h1>
              <p className="text-gray-600">오버타임 승인 및 관리</p>
            </div>
          )}
          {currentView === 'reports' && (
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">보고서</h1>
              <p className="text-gray-600">급여 및 오버타임 보고서</p>
            </div>
          )}
          {currentView === 'settings' && (
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">설정</h1>
              <p className="text-gray-600">시스템 설정</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestDashboard; 