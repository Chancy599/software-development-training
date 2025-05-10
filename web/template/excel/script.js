// Show login modal
function showLogin() {
  const popup = document.getElementById("loginPopup");
  popup.style.display = "flex"; // 激活 CSS 动画
  // 重触发动画
  popup.classList.remove("login-popup"); // 触发 animation
  void popup.offsetWidth; // 强制重绘
  popup.classList.add("login-popup");
}

function hideLogin() {
  document.getElementById("loginPopup").style.display = "none";
}

function showMessage(success, customText) {
  const box = document.getElementById("messageBox");
  const img = document.getElementById("messageImage");
  const text = document.getElementById("messageText");

  // 设置内容
  if (success) {
    img.src = "right.png";
    text.textContent = customText || "操作成功！";
  } else {
    img.src = "wrong.png";
    text.textContent = customText || "操作失败，请重试";
  }

  // 显示并开始动画
  box.style.display = "flex";
  box.classList.remove("hide");
  box.classList.add("show");

  // 2 秒后自动隐藏
  setTimeout(() => {
    box.classList.remove("show");
    box.classList.add("hide");

    // 淡出动画结束后隐藏元素
    setTimeout(() => {
      box.style.display = "none";
    }, 400);
  }, 2000);
}

// 存储用户 ID
let currentUserId = "";

async function submitLogin() {
  const id = document.getElementById("userid").value;
  const password = document.getElementById("password").value;

  const payload = { id, password };

  try {
    const response = await fetch("http://localhost:5011/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.text();
      if (result === "True") {
        currentUserId = id; // 保存用户 ID
        hideLogin(); // ✅ 隐藏登录浮窗
        showMessage(true, "登录成功！");
		loginSuccess()
      } else {
        showMessage(false, "登录失败，请重试");
      }
    } else {
      showMessage(false, "登录失败，请重试");
    }
  } catch (error) {
    console.error("请求失败：", error);
    showMessage(false, "登录失败，请重试");
  }
}

// 获取班级名单（使用 POST 请求）
async function getClassNames() {
  if (!currentUserId) {
    console.error("未登录");
    return [];
  }

  const payload = { id: currentUserId };

  try {
    const response = await fetch("http://localhost:5012/getClassName", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("获取班级名单失败");
      return [];
    }
  } catch (error) {
    console.error("获取班级名单请求失败:", error);
    return [];
  }
}

// 获取起始时间（使用 POST 请求）
async function getStartTimes(className) {
  if (!className) {
    console.error("未选择班级");
    return [];
  }

  const payload = { class_name: className };

  try {
    const response = await fetch("http://localhost:5012/getStartTime", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("获取起始时间失败");
      return [];
    }
  } catch (error) {
    console.error("获取起始时间请求失败:", error);
    return [];
  }
}

// 更新面板内容
async function updatePanelContent(type) {
  const panelContent = document.querySelector('.panel-content');
  panelContent.innerHTML = ''; // 清空现有内容
  
  if (type === 'import') {
    // 导入选项中只需要按钮，不需要其他内容
    // 创建上传提示
    const uploadPrompt = document.createElement('div');
    uploadPrompt.className = 'upload-prompt';
    uploadPrompt.innerHTML = '<p>点击下方按钮选择Excel文件导入</p>';
    panelContent.appendChild(uploadPrompt);
    
    // 修改操作按钮文本
    const actionButton = document.getElementById('actionButton');
    if (actionButton) {
      actionButton.textContent = '选择文件导入';
    }
  } else if (type === 'export') {
    // 功能选择
    const functionGroup = document.createElement('div');
    functionGroup.className = 'form-group';
    
    const functionLabel = document.createElement('label');
    functionLabel.className = 'form-label';
    functionLabel.textContent = '功能：';
    
    const functionSelect = document.createElement('select');
    functionSelect.className = 'form-select';
    functionSelect.id = 'functionSelect';
    
    // 添加默认选项
    const defaultFunctionOption = document.createElement('option');
    defaultFunctionOption.value = '';
    defaultFunctionOption.textContent = '请选择功能';
    defaultFunctionOption.selected = true;
    defaultFunctionOption.disabled = true;
    functionSelect.appendChild(defaultFunctionOption);
    
    // 添加功能选项
    const functionOptions = ['班级名单', '签到名单'];
    functionOptions.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      functionSelect.appendChild(optionElement);
    });
    
    functionGroup.appendChild(functionLabel);
    functionGroup.appendChild(functionSelect);
    panelContent.appendChild(functionGroup);
    
    // 班级选择
    const result = await getClassNames();
    const classNames = result['class_names'];
    const classGroup = document.createElement('div');
    classGroup.className = 'form-group';
    
    const classLabel = document.createElement('label');
    classLabel.className = 'form-label';
    classLabel.textContent = '班级：';
    
    const classSelect = document.createElement('select');
    classSelect.className = 'form-select';
    classSelect.id = 'classSelect';
    classSelect.disabled = true; // 初始化时禁用，直到选择了功能
    
    // 添加默认选项
    const defaultClassOption = document.createElement('option');
    defaultClassOption.value = '';
    defaultClassOption.textContent = '请先选择功能';
    defaultClassOption.selected = true;
    defaultClassOption.disabled = true;
    classSelect.appendChild(defaultClassOption);
    
    // 添加班级选项
    classNames.forEach(className => {
      const option = document.createElement('option');
      option.value = className;
      option.textContent = className;
      classSelect.appendChild(option);
    });
    
    classGroup.appendChild(classLabel);
    classGroup.appendChild(classSelect);
    panelContent.appendChild(classGroup);
    
    // 起始时间选择（初始为隐藏状态）
    const timeGroup = document.createElement('div');
    timeGroup.className = 'form-group';
    timeGroup.id = 'timeFormGroup';
    timeGroup.style.display = 'none'; // 初始隐藏
    
    const timeLabel = document.createElement('label');
    timeLabel.className = 'form-label';
    timeLabel.textContent = '起始时间：';
    
    const timeSelect = document.createElement('select');
    timeSelect.className = 'form-select';
    timeSelect.id = 'timeSelect';
    timeSelect.disabled = true;
    
    // 添加默认选项
    const defaultTimeOption = document.createElement('option');
    defaultTimeOption.value = '';
    defaultTimeOption.textContent = '请先选择班级';
    defaultTimeOption.selected = true;
    defaultTimeOption.disabled = true;
    timeSelect.appendChild(defaultTimeOption);
    
    timeGroup.appendChild(timeLabel);
    timeGroup.appendChild(timeSelect);
    panelContent.appendChild(timeGroup);
    
    // 当功能选择变化时处理
    functionSelect.addEventListener('change', function() {
      const selectedFunction = this.value;
      const timeGroup = document.getElementById('timeFormGroup');
      
      // 启用班级选择
      classSelect.disabled = false;
      classSelect.options[0].textContent = '请选择班级';
      
      // 根据功能显示/隐藏时间选择
      if (selectedFunction === '签到名单') {
        timeGroup.style.display = 'block';
      } else {
        timeGroup.style.display = 'none';
      }
      
      // 重置班级选择
      classSelect.value = '';
    });
    
    // 当班级选择变化时更新起始时间选项
    classSelect.addEventListener('change', async function() {
      const selectedClass = this.value;
      const functionSelect = document.getElementById('functionSelect');
      const selectedFunction = functionSelect.value;
      
      if (!selectedClass) return;
      
      // 如果选择了签到名单，则获取并显示起始时间
      if (selectedFunction === '签到名单') {
        // 获取起始时间
        const result = await getStartTimes(selectedClass);
        const startTimes = result['start_times'];
        
        // 更新起始时间选择框
        timeSelect.innerHTML = '';
        timeSelect.disabled = false;
        
        // 添加默认选项
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '请选择起始时间';
        defaultOption.selected = true;
        defaultOption.disabled = true;
        timeSelect.appendChild(defaultOption);
        
        // 添加时间选项
        startTimes.forEach(time => {
          const option = document.createElement('option');
          option.value = time;
          option.textContent = time;
          timeSelect.appendChild(option);
        });
      }
    });
    
    // 修改操作按钮文本
    const actionButton = document.getElementById('actionButton');
    if (actionButton) {
      actionButton.textContent = '导出Excel';
    }
  }
}

// Show expanded view with side panel
async function showExpandedView(type) {
  const mainContent = document.getElementById('mainContent');
  const expandedView = document.getElementById('expandedView');
  const expandedCard = document.getElementById('expandedCard');
  const sidePanel = document.getElementById('sidePanel');
  const panelTitle = document.getElementById('panelTitle');
  const actionButton = document.getElementById('actionButton');
  
  // Configure based on type
  if (type === 'import') {
    expandedCard.className = 'expanded-card import-card';
    expandedCard.innerHTML = `
      <div class="card-icon" style="font-size: 96px;">📥</div>
      <div class="card-title" style="font-size: 2rem;">导入Excel</div>
      <div class="card-description" style="font-size: 1.2rem;">快速创建你的新班级</div>
    `;
    panelTitle.textContent = '导入选项';
    if (actionButton) {
      actionButton.textContent = '选择文件导入';
    }
  } else {
    expandedCard.className = 'expanded-card export-card';
    expandedCard.innerHTML = `
      <div class="card-icon" style="font-size: 96px;">📤</div>
      <div class="card-title" style="font-size: 2rem;">导出Excel</div>
      <div class="card-description" style="font-size: 1.2rem;">在本地管理班级和签到记录</div>
    `;
    panelTitle.textContent = '导出选项';
    if (actionButton) {
      actionButton.textContent = '导出Excel';
    }
  }
  
  // Show expanded view with faster animation
  mainContent.style.opacity = 0;
  setTimeout(() => {
    mainContent.style.display = 'none';
    expandedView.classList.add('active');
    
    // Add a small delay before showing the side panel for a smooth transition
    setTimeout(() => {
      sidePanel.classList.add('active');
      // 在显示面板后更新内容
      updatePanelContent(type);
    }, 400); // 增加侧面板滑入时间
  }, 200); // 减少主卡片消失时间
}

// Close expanded view
function closeExpandedView() {
  const mainContent = document.getElementById('mainContent');
  const expandedView = document.getElementById('expandedView');
  const sidePanel = document.getElementById('sidePanel');
  
  // First hide the side panel
  sidePanel.classList.remove('active');
  
  // Then hide the expanded view with a delay
  setTimeout(() => {
    expandedView.classList.remove('active');
    mainContent.style.display = 'block';
    
    // Fade the main content back in
    setTimeout(() => {
      mainContent.style.opacity = 1;
    }, 100);
  }, 300);
}

// Handle action button in side panel
document.getElementById('actionButton').addEventListener('click', async function () {
  const isExport = document.getElementById('panelTitle').textContent === '导出选项';

  if (isExport) {
    const functionSelect = document.getElementById('functionSelect');
    const classSelect = document.getElementById('classSelect');
    const timeSelect = document.getElementById('timeSelect');
    
    if (!functionSelect || !classSelect) {
      showMessage(false, "未找到必要的表单元素");
      return;
    }
    
    // 收集表单数据
    const formData = {
      func: functionSelect.value
    };
    
    // 验证功能选择
    if (!formData.func) {
      showMessage(false, "请选择导出功能");
      return;
    }
    
    // 添加班级名称
    if (classSelect.value) {
      formData.class_name = classSelect.value;
    } else {
      showMessage(false, "请选择班级");
      return;
    }
    
    // 如果是签到名单，需要添加开始时间
    if (functionSelect.value === "签到名单") {
      if (timeSelect && timeSelect.value) {
        formData.start_time = timeSelect.value;
      } else {
        showMessage(false, "请选择开始时间");
        return;
      }
    }
    
    // 构建查询字符串
    const queryString = new URLSearchParams(formData).toString();
    
    try {
      // 发送 GET 请求，查询字符串传递参数
      const response = await fetch(`http://localhost:5012/mysql_to_excel?${queryString}`, {
        method: "GET"
        // 不要设置 Content-Type header，因为这是 GET 请求且参数在 URL 中
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "导出失败");
      }
      
      // 获取返回的文件数据
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // 生成合适的文件名
      let fileName = "导出结果.xlsx";
      if (formData.func === "班级名单") {
        fileName = `${formData.class_name}班级名单.xlsx`;
      } else if (formData.func === "签到名单") {
        fileName = `${formData.class_name}_${formData.start_time}_签到名单.xlsx`;
      }
      
      // 创建下载链接
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; 
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // 释放资源
      
      showMessage(true, "Excel导出成功"); // 显示成功消息
    } catch (error) {
      console.error("导出失败:", error);
      showMessage(false, error.message || "Excel导出失败"); // 显示失败消息
    }
  } else {
    // 创建并触发文件选择框
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".xls,.xlsx";

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files[0];
      if (!file) {
        showMessage(false, "未选择文件");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("func", "新增班级");

      try {
        const response = await fetch("http://localhost:5012/excel_to_mysql", {
          method: "POST",
          body: formData,
          // 不要设置 Content-Type，让浏览器自动设置包含boundary的multipart/form-data
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "导入失败");
        }

        const result = await response.text();
        console.log("导入成功:", result);
        showMessage(true, "Excel导入成功");
      } catch (error) {
        console.error("导入失败:", error);
        showMessage(false, error.message || "Excel导入失败");
      }
    });

    // 模拟点击打开选择文件窗口
    fileInput.click();
  }
});

// Function for file upload (original function to keep compatibility)
function showFileUpload(type) {
  showExpandedView(type);
}

// Function for export (original function to keep compatibility)
function exportExcel() {
  showExpandedView('export');
}

// 模拟登录成功后调用此函数
function loginSuccess() {
  localStorage.setItem('user', currentUserId);

  document.getElementById('loginButton').style.display = 'none';
  document.getElementById('userAvatar').style.display = 'flex';
}

// 显示或隐藏退出登录模态框
function toggleLogoutModal() {
  const modal = document.getElementById('logoutModal');
  const isVisible = modal.style.opacity === '1';

  // 显示模态框时，确保有动画效果
  if (isVisible) {
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
  } else {
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
  }
}

// 退出登录逻辑
function logout() {
  // 关闭模态框
  toggleLogoutModal();

  // 显示登录按钮，隐藏头像
  document.getElementById('loginButton').style.display = 'block';
  document.getElementById('userAvatar').style.display = 'none';

  // 可加：清除本地存储/状态，跳转页面等
  alert('已退出登录');
	  // 刷新页面
  location.reload();
}

window.onload = function () {
  const user = localStorage.getItem('user');
  if (user) {
    loginSuccess(); // 自动显示头像
	const currentUserId = localStorage.getItem('user');
  }
};
