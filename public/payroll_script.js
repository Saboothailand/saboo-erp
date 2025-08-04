// 회사 설정 관리
const CompanySettings = {
    defaultSettings: {
        companyName: "Saboo (Thailand) Co.,Ltd",
        companyAddress: "55/20 MOO 4, TAMBON BUNG KHAM PROY, AMPHUR LAM LUK KA, PATHUM THANI 12150 THAILAND",
        companyPhone: "TEL. 02-159-9880",
        companyEmail: "hr@saboo.co.th",
        logoText: "S",
        logoImage: null,
        documentTitle: "급여명세서",
        documentSubtitle: "급여명세서",
        footerContact: "본 급여명세서에 대한 문의사항은 인사팀으로 연락주시기 바랍니다.",
        footerSupport: "급여 관련 세무 상담은 세무팀에서 지원해드립니다."
    },

    load: function() {
        const saved = localStorage.getItem('companySettings');
        if (saved) {
            return JSON.parse(saved);
        }
        return this.defaultSettings;
    },

    save: function(settings) {
        localStorage.setItem('companySettings', JSON.stringify(settings));
    },

    reset: function() {
        localStorage.removeItem('companySettings');
        this.updateUI(this.defaultSettings);
    },

    updateUI: function(settings) {
        document.getElementById('companyName').textContent = settings.companyName;
        document.getElementById('companyAddress').textContent = settings.companyAddress;
        document.getElementById('companyPhone').textContent = settings.companyPhone;
        document.getElementById('companyEmail').textContent = settings.companyEmail;
        
        // 문서 제목과 부제목 업데이트
        if (settings.documentTitle) {
            document.getElementById('documentTitle').textContent = settings.documentTitle;
        }
        if (settings.documentSubtitle) {
            document.getElementById('documentSubtitle').textContent = settings.documentSubtitle;
        }
        
        // 하단 내용 업데이트
        if (settings.footerContact) {
            document.getElementById('footerContact').textContent = settings.footerContact;
        }
        if (settings.footerSupport) {
            document.getElementById('footerSupport').textContent = settings.footerSupport;
        }
        
        const logoText = document.getElementById('logoText');
        const logoImage = document.getElementById('logoImage');
        
        if (settings.logoImage) {
            logoText.style.display = 'none';
            logoImage.style.display = 'block';
            logoImage.src = settings.logoImage;
        } else {
            logoText.style.display = 'block';
            logoImage.style.display = 'none';
            logoText.textContent = settings.logoText;
        }
    }
};

// 로고 관리
const LogoManager = {
    upload: function(file) {
        if (file && file.type.startsWith('image/')) {
            if (file.size > 2 * 1024 * 1024) {
                alert('파일 크기는 2MB 이하여야 합니다.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const settings = CompanySettings.load();
                settings.logoImage = e.target.result;
                settings.logoText = '';
                CompanySettings.save(settings);
                CompanySettings.updateUI(settings);
                
                // 모달 미리보기 업데이트
                const preview = document.getElementById('logoUploadPreview');
                const text = document.getElementById('logoUploadText');
                preview.src = e.target.result;
                preview.style.display = 'block';
                text.style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            alert('이미지 파일만 업로드 가능합니다.');
        }
    },

    reset: function() {
        const settings = CompanySettings.load();
        settings.logoImage = null;
        settings.logoText = 'S';
        CompanySettings.save(settings);
        CompanySettings.updateUI(settings);
        
        // 모달 미리보기 초기화
        const preview = document.getElementById('logoUploadPreview');
        const text = document.getElementById('logoUploadText');
        preview.style.display = 'none';
        text.style.display = 'block';
    }
};

// 모달 관리
function openSettings() {
    const settings = CompanySettings.load();
    document.getElementById('modalCompanyName').value = settings.companyName;
    document.getElementById('modalCompanyAddress').value = settings.companyAddress;
    document.getElementById('modalCompanyPhone').value = settings.companyPhone;
    document.getElementById('modalCompanyEmail').value = settings.companyEmail;
    document.getElementById('modalDocumentTitle').value = settings.documentTitle || '급여명세서';
    document.getElementById('modalDocumentSubtitle').value = settings.documentSubtitle || '급여명세서';
    document.getElementById('modalFooterContact').value = settings.footerContact || '본 급여명세서에 대한 문의사항은 인사팀으로 연락주시기 바랍니다.';
    document.getElementById('modalFooterSupport').value = settings.footerSupport || '급여 관련 세무 상담은 세무팀에서 지원해드립니다.';
    
    // 로고 미리보기 설정
    const preview = document.getElementById('logoUploadPreview');
    const text = document.getElementById('logoUploadText');
    if (settings.logoImage) {
        preview.src = settings.logoImage;
        preview.style.display = 'block';
        text.style.display = 'none';
    } else {
        preview.style.display = 'none';
        text.style.display = 'block';
    }
    
    document.getElementById('settingsModal').style.display = 'block';
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

function saveSettings() {
    const settings = CompanySettings.load();
    settings.companyName = document.getElementById('modalCompanyName').value;
    settings.companyAddress = document.getElementById('modalCompanyAddress').value;
    settings.companyPhone = document.getElementById('modalCompanyPhone').value;
    settings.companyEmail = document.getElementById('modalCompanyEmail').value;
    settings.documentTitle = document.getElementById('modalDocumentTitle').value;
    settings.documentSubtitle = document.getElementById('modalDocumentSubtitle').value;
    settings.footerContact = document.getElementById('modalFooterContact').value;
    settings.footerSupport = document.getElementById('modalFooterSupport').value;
    
    CompanySettings.save(settings);
    CompanySettings.updateUI(settings);
    closeSettings();
    
    alert('설정이 저장되었습니다.');
}

function resetSettings() {
    if (confirm('모든 설정을 기본값으로 초기화하시겠습니까?')) {
        CompanySettings.reset();
        closeSettings();
        alert('설정이 초기화되었습니다.');
    }
}

function resetLogo() {
    LogoManager.reset();
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        LogoManager.upload(file);
    }
}

// 드래그 앤 드롭 기능
document.addEventListener('DOMContentLoaded', function() {
    const logoUpload = document.getElementById('logoUpload');
    
    logoUpload.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    logoUpload.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });

    logoUpload.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            LogoManager.upload(files[0]);
        }
    });
});

// 데이터 내보내기
function exportData() {
    const settings = CompanySettings.load();
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'company_settings.json';
    link.click();
    URL.revokeObjectURL(url);
}

// PDF 다운로드
function downloadPDF() {
    alert('브라우저의 인쇄 기능을 사용하여 "대상"을 "PDF로 저장"으로 선택하세요.');
    window.print();
}

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        window.print();
    }
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveSettings();
    }
});

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('settingsModal');
    if (event.target === modal) {
        closeSettings();
    }
}

// 인쇄 이벤트 처리
window.addEventListener('beforeprint', function() {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', function() {
    document.body.classList.remove('printing');
});

// 페이지 로드 시 설정 적용
document.addEventListener('DOMContentLoaded', function() {
    const settings = CompanySettings.load();
    CompanySettings.updateUI(settings);
    
    // 발급일 설정
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const dateFormatted = today.getFullYear() + '년 ' + (today.getMonth() + 1) + '월 ' + today.getDate() + '일';
    
    document.getElementById('issueDate').textContent = dateString;
    document.getElementById('issueDateFooter').textContent = dateFormatted;

    // URL 파라미터에서 급여 데이터 읽기
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    
    if (dataParam) {
        try {
            const payrollData = JSON.parse(decodeURIComponent(dataParam));
            updatePayrollTemplate(payrollData);
        } catch (error) {
            console.error('급여 데이터 파싱 오류:', error);
        }
    }
});

// 급여명세서 템플릿 업데이트 함수
function updatePayrollTemplate(data) {
    const { employee, payroll, company } = data;
    
    // 기존 설정 로드
    const settings = CompanySettings.load();
    
    if (company) {
        // 회사 정보 업데이트 (설정이 우선)
        if (settings.companyName) {
            document.getElementById('companyName').textContent = settings.companyName;
        } else if (company.company_name) {
            document.getElementById('companyName').textContent = company.company_name;
        }
        if (settings.companyAddress) {
            document.getElementById('companyAddress').textContent = settings.companyAddress;
        } else if (company.address) {
            document.getElementById('companyAddress').textContent = company.address;
        }
        if (settings.companyPhone) {
            document.getElementById('companyPhone').textContent = settings.companyPhone;
        } else if (company.phone) {
            document.getElementById('companyPhone').textContent = company.phone;
        }
        if (settings.companyEmail) {
            document.getElementById('companyEmail').textContent = settings.companyEmail;
        } else if (company.email) {
            document.getElementById('companyEmail').textContent = company.email;
        }
    }
    
    if (employee) {
        // 직원 정보 업데이트
        const employeeCells = document.querySelectorAll('.employee-cell .cell-value');
        if (employeeCells.length >= 8) {
            employeeCells[0].textContent = employee.full_name || employee.nick_name || 'N/A';
            employeeCells[1].textContent = employee.employee_code || 'N/A';
            employeeCells[2].textContent = employee.employee_code || 'N/A';
            employeeCells[3].textContent = 'Senior Developer'; // 직급은 기본값
            employeeCells[4].textContent = employee.department || 'N/A';
            employeeCells[5].textContent = 'Senior Developer'; // 직급은 기본값
            employeeCells[6].textContent = `${payroll.pay_year}년 ${payroll.pay_month}월`;
            employeeCells[7].textContent = payroll.status === 'APPROVED' ? '확정' : '초안';
        }
    }
    
    if (payroll) {
        // 급여 정보 업데이트
        const baseSalary = payroll.base_salary || 0;
        const performanceBonus = payroll.performance_bonus || 0;
        const specialBonus = payroll.special_bonus || 0;
        const positionAllowance = payroll.position_allowance || 0;
        const mealAllowance = payroll.meal_allowance || 0;
        const transportAllowance = payroll.transport_allowance || 0;
        const socialInsurance = payroll.social_insurance || 0;
        const personalTax = payroll.personal_tax || 0;
        const advanceSalary = payroll.advance_salary || 0;
        const salaryDeduction = payroll.salary_deduction || 0;
        const otherDeductions = payroll.other_deductions || 0;
        
        // 총 지급액 계산
        const totalPayments = baseSalary + performanceBonus + specialBonus + positionAllowance + mealAllowance + transportAllowance;
        // 총 공제액 계산
        const totalDeductions = socialInsurance + personalTax + advanceSalary + salaryDeduction + otherDeductions;
        // 실수령액 계산
        const netSalary = totalPayments - totalDeductions;
        
        // 급여 테이블 업데이트
        const salaryTable = document.querySelector('.salary-table tbody');
        if (salaryTable) {
            const rows = salaryTable.querySelectorAll('tr');
            
            // 기본급
            if (rows[0]) {
                const cells = rows[0].querySelectorAll('td');
                if (cells.length >= 3) {
                    cells[2].textContent = baseSalary.toLocaleString();
                }
            }
            
            // 성과급
            if (rows[1]) {
                const cells = rows[1].querySelectorAll('td');
                if (cells.length >= 3) {
                    cells[2].textContent = performanceBonus.toLocaleString();
                }
            }
            
            // 특별상여금
            if (rows[2]) {
                const cells = rows[2].querySelectorAll('td');
                if (cells.length >= 3) {
                    cells[2].textContent = specialBonus.toLocaleString();
                }
            }
            
            // 직책수당
            if (rows[3]) {
                const cells = rows[3].querySelectorAll('td');
                if (cells.length >= 3) {
                    cells[2].textContent = positionAllowance.toLocaleString();
                }
            }
            
            // 식대
            if (rows[4]) {
                const cells = rows[4].querySelectorAll('td');
                if (cells.length >= 3) {
                    cells[2].textContent = mealAllowance.toLocaleString();
                }
            }
            
            // 교통비
            if (rows[5]) {
                const cells = rows[5].querySelectorAll('td');
                if (cells.length >= 3) {
                    cells[2].textContent = transportAllowance.toLocaleString();
                }
            }
            
            // 공제 항목들
            if (rows[0]) {
                const cells = rows[0].querySelectorAll('td');
                if (cells.length >= 5) {
                    cells[4].textContent = personalTax.toLocaleString();
                }
            }
            
            if (rows[1]) {
                const cells = rows[1].querySelectorAll('td');
                if (cells.length >= 5) {
                    cells[4].textContent = socialInsurance.toLocaleString();
                }
            }
            
            // 총계 행 업데이트
            const totalRow = rows[rows.length - 3]; // 총계 행
            if (totalRow) {
                const cells = totalRow.querySelectorAll('td');
                if (cells.length >= 5) {
                    cells[2].textContent = totalPayments.toLocaleString();
                    cells[4].textContent = totalDeductions.toLocaleString();
                }
            }
            
            // 실수령액 행 업데이트
            const finalRow = rows[rows.length - 1]; // 실수령액 행
            if (finalRow) {
                const cells = finalRow.querySelectorAll('td');
                if (cells.length >= 5) {
                    cells[4].textContent = netSalary.toLocaleString();
                }
            }
        }
    }
} 