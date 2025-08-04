'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-6">
          Saboo ERP
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          통합 기업 자원 관리 시스템
        </p>
        <div className="space-x-4">
          <Link 
            href="/dashboard" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            대시보드 접속
          </Link>
          <Link 
            href="/admin" 
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            관리자 로그인
          </Link>
        </div>
      </div>
    </main>
  )
} 