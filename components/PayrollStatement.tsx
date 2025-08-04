'use client'

import React from 'react'
import { PayrollStatement, Employee } from '@/lib/supabase'

interface PayrollStatementProps {
  payroll: PayrollStatement
  employee?: Employee
  onClose: () => void
}

const PayrollStatementComponent: React.FC<PayrollStatementProps> = ({ 
  payroll, 
  employee, 
  onClose 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  const calculateGrossSalary = () => {
    return (payroll.base_salary || 0) + 
           (payroll.position_allowance || 0) + 
           (payroll.meal_allowance || 0) + 
           (payroll.transport_allowance || 0) + 
           (payroll.performance_bonus || 0) + 
           (payroll.special_bonus || 0)
  }

  const calculateTotalDeductions = () => {
    return (payroll.social_insurance || 0) + 
           (payroll.personal_tax || 0) + 
           (payroll.advance_salary || 0) + 
           (payroll.salary_deduction || 0) + 
           (payroll.other_deductions || 0)
  }

  const calculateNetSalary = () => {
    return calculateGrossSalary() - calculateTotalDeductions()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">급여명세서</h1>
              <p className="text-blue-100">PAYROLL STATEMENT</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* 급여 기간 정보 */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">급여 기간</label>
              <p className="text-lg font-semibold">
                {formatDate(payroll.pay_period_start)} ~ {formatDate(payroll.pay_period_end)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">지급일</label>
              <p className="text-lg font-semibold">{formatDate(payroll.payment_date)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">근무일수</label>
              <p className="text-lg font-semibold">
                {payroll.actual_work_days}일 / {payroll.work_days}일
              </p>
            </div>
          </div>
        </div>

        {/* 직원 정보 */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold mb-4 text-gray-800">직원 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">직원코드</label>
              <p className="text-lg font-semibold">{employee?.employee_code || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">성명</label>
              <p className="text-lg font-semibold">{employee?.full_name || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">부서</label>
              <p className="text-lg font-semibold">{employee?.department || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">입사일</label>
              <p className="text-lg font-semibold">{employee?.start_date ? formatDate(employee.start_date) : '-'}</p>
            </div>
          </div>
        </div>

        {/* 급여 상세 내역 */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">급여 상세 내역</h2>
          
          {/* 지급 항목 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-green-700">지급 항목</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">기본급</span>
                <span className="font-semibold">{formatCurrency(payroll.base_salary || 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">직책수당</span>
                <span className="font-semibold">{formatCurrency(payroll.position_allowance || 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">식대</span>
                <span className="font-semibold">{formatCurrency(payroll.meal_allowance || 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">교통비</span>
                <span className="font-semibold">{formatCurrency(payroll.transport_allowance || 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">성과보너스</span>
                <span className="font-semibold">{formatCurrency(payroll.performance_bonus || 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">특별보너스</span>
                <span className="font-semibold">{formatCurrency(payroll.special_bonus || 0)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-green-50 border-t-2 border-green-200">
                <span className="text-lg font-bold text-green-800">지급 총액</span>
                <span className="text-lg font-bold text-green-800">{formatCurrency(calculateGrossSalary())}</span>
              </div>
            </div>
          </div>

          {/* 공제 항목 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-red-700">공제 항목</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">사회보험료</span>
                <span className="font-semibold text-red-600">-{formatCurrency(payroll.social_insurance || 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">개인소득세</span>
                <span className="font-semibold text-red-600">-{formatCurrency(payroll.personal_tax || 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">가불금</span>
                <span className="font-semibold text-red-600">-{formatCurrency(payroll.advance_salary || 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">급여공제</span>
                <span className="font-semibold text-red-600">-{formatCurrency(payroll.salary_deduction || 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">기타공제</span>
                <span className="font-semibold text-red-600">-{formatCurrency(payroll.other_deductions || 0)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-red-50 border-t-2 border-red-200">
                <span className="text-lg font-bold text-red-800">공제 총액</span>
                <span className="text-lg font-bold text-red-800">-{formatCurrency(calculateTotalDeductions())}</span>
              </div>
            </div>
          </div>

          {/* 실수령액 */}
          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-blue-800">실수령액</span>
              <span className="text-3xl font-bold text-blue-800">{formatCurrency(calculateNetSalary())}</span>
            </div>
            <p className="text-sm text-blue-600 mt-2">
              {formatCurrency(calculateGrossSalary())} - {formatCurrency(calculateTotalDeductions())} = {formatCurrency(calculateNetSalary())}
            </p>
          </div>

          {/* 특이사항 */}
          {payroll.bonus_reason && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">특이사항</h4>
              <p className="text-yellow-700">{payroll.bonus_reason}</p>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>발급일: {new Date().toLocaleDateString('ko-KR')}</p>
              <p>발급자: 인사팀</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>본 명세서는 급여 지급의 근거가 됩니다.</p>
              <p>문의사항이 있으시면 인사팀으로 연락주세요.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayrollStatementComponent 