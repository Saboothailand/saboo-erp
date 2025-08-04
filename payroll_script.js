// 회사 설정 관리
const CompanySettings = {
    defaultSettings: {
        companyName: "Saboo (Thailand) Co.,Ltd",
        companyAddress: "55/20 MOO 4, TAMBON BUNG KHAM PROY, AMPHUR LAM LUK KA, PATHUM THANI 12150 THAILAND",
        companyPhone: "TEL. 02-159-9880",
        companyEmail: "hr@saboo.co.th",
        logoText: "S",
        logoImage: null
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
}); 