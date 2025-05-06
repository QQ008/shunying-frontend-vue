<template>
  <div class="about-view">
    <!-- 自定义顶部栏 -->
    <div class="custom-header">
      <div class="back-button" @click="router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 class="page-title">关于瞬影</h1>
      <div class="right-placeholder"></div>
    </div>

    <!-- 选项卡导航 -->
    <div class="tabs-container">
      <div class="tab-nav" ref="tabNavRef">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-item"
          :class="{ active: activeTab === tab.id }"
          @click="switchTab(tab.id)"
        >
          {{ tab.name }}
        </div>
        <div class="tab-indicator" :style="indicatorStyle"></div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-container">
      <!-- 关于瞬影 -->
      <div v-if="activeTab === 'about'" class="section">
        <div class="vision-card">
          <div class="light-effect"></div>
          <h2 class="vision-card-title">愿景与理念</h2>
          <div class="vision-card-content">
            瞬影致力于为公路自行车等骑行场景的摄影师与骑行者搭建一个便捷、高效、智能的线上照片管理与交易平台。我们相信，每一个热爱骑行的瞬间都值得被完美记录。
          </div>
        </div>

        <h2 class="section-title">平台优势</h2>
        <div class="advantage-cards">
          <div class="advantage-card">
            <div class="advantage-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#9966FF" stroke-width="2"/>
                <path d="M12 7V12L16 14" stroke="#9966FF" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3 class="advantage-title">高效查找</h3>
            <p class="advantage-desc">通过多维条件筛选，骑行者可以在海量照片中快速定位自己的照片，节省宝贵时间。</p>
          </div>

          <div class="advantage-card">
            <div class="advantage-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#9966FF" stroke-width="2"/>
                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 9H9.01" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 9H15.01" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="advantage-title">智能分组</h3>
            <p class="advantage-desc">自动识别同一骑行者的多张照片并智能分组，避免用户在海量图片中迷失。</p>
          </div>

          <div class="advantage-card">
            <div class="advantage-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 16L8.58579 11.4142C9.36683 10.6332 10.6332 10.6332 11.4142 11.4142L16 16M14 14L15.5858 12.4142C16.3668 11.6332 17.6332 11.6332 18.4142 12.4142L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="advantage-title">智能处理</h3>
            <p class="advantage-desc">自动废片筛选、批量调色、智能裁切，让每一张照片都呈现最佳效果。</p>
          </div>

          <div class="advantage-card">
            <div class="advantage-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="advantage-title">隐私保障</h3>
            <p class="advantage-desc">严格的隐私保护措施，用户可以管理自己的照片显示与权限，安心享受服务。</p>
          </div>
        </div>

        <h2 class="section-title">平台介绍</h2>
        <div class="section-content">
          <p>瞬影平台专注于公路自行车等骑行场景的摄影与照片分发，目前主要服务北京地区的骑行爱好者。</p>
          <p>我们的平台连接摄影师与骑行者，通过先进的技术手段解决双方的痛点：摄影师无需再手动筛选和处理海量照片，骑行者可以轻松找到并购买自己的精彩瞬间。</p>
          <p>未来，我们计划拓展至更多城市和更多运动类型，打造一个全面的运动摄影服务生态系统。</p>
        </div>
      </div>

      <!-- 加入瞬影 -->
      <div v-if="activeTab === 'join'" class="section">
        <h2 class="section-title">加入瞬影</h2>
        <div class="section-content">
          <p>无论您是专业摄影师还是摄影爱好者，只要您热爱骑行文化、擅长捕捉精彩瞬间，都欢迎加入瞬影摄影师团队。</p>
        </div>

        <div class="join-card">
          <h3 class="join-title">成为瞬影摄影师</h3>
          <p class="join-desc">加入我们的摄影师团队，享受智能照片处理、自动客户匹配和透明收益管理，让您专注于创作精彩照片。</p>
          <button class="join-button" @click="applyAsPhotographer">立即申请</button>
        </div>

        <h2 class="section-title">申请流程</h2>
        <div class="section-content">
          <p>1. 提交基本信息和摄影作品样本</p>
          <p>2. 平台审核您的资质和作品（3-5个工作日）</p>
          <p>3. 审核通过后，完成账号设置和培训</p>
          <p>4. 开始使用瞬影平台服务骑行爱好者</p>
          <p>我们会为入驻摄影师提供完整的培训和技术支持，确保您能够充分利用平台的各项功能。</p>
        </div>
      </div>

      <!-- 联系我们 -->
      <div v-if="activeTab === 'contact'" class="section">
        <h2 class="section-title">联系我们</h2>
        <div class="section-content">
          <p>如果您有任何问题、建议或合作意向，欢迎通过以下方式联系我们。我们的团队将在工作日24小时内回复您的咨询。</p>
        </div>

        <div class="contact-methods">
          <div class="contact-method">
            <div class="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="contact-title">电子邮件</h3>
            <p class="contact-value">contact@snapmotion.cn</p>
          </div>

          <div class="contact-method">
            <div class="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17V17.01M12 14C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12C11.4477 12 11 12.4477 11 13C11 13.5523 11.4477 14 12 14ZM12 14V11M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM5 20L7 15L7.75 16.5M19 20L17 15L16.25 16.5M7.75 16.5C8.9 18.5 10.5 20 12 20C13.5 20 15.1 18.5 16.25 16.5M7.75 16.5L16.25 16.5" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="contact-title">官方微信</h3>
            <p class="contact-value">snapmotion_official</p>
          </div>

          <div class="contact-method">
            <div class="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="contact-title">联系电话</h3>
            <p class="contact-value">010-88888888</p>
          </div>

          <div class="contact-method">
            <div class="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.6569 16.6569C16.7202 17.5935 14.7616 19.5521 13.4138 20.8999C12.6327 21.681 11.3677 21.6814 10.5866 20.9003C9.26234 19.576 7.34159 17.6553 6.34315 16.6569C3.21895 13.5327 3.21895 8.46734 6.34315 5.34315C9.46734 2.21895 14.5327 2.21895 17.6569 5.34315C20.781 8.46734 20.781 13.5327 17.6569 16.6569Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="contact-title">公司地址</h3>
            <p class="contact-value">北京市海淀区中关村创业大厦B座5层</p>
          </div>
        </div>

        <h2 class="section-title">商务合作</h2>
        <div class="section-content">
          <p>我们欢迎与骑行俱乐部、自行车品牌、体育赛事组织者以及其他相关企业和机构建立合作关系。</p>
          <p>请发送合作意向至：business@snapmotion.cn</p>
        </div>
      </div>

      <!-- 常见问题 -->
      <div v-if="activeTab === 'faq'" class="section">
        <h2 class="section-title">常见问题</h2>
        <div class="faq-list">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="faq-item"
          >
            <div class="faq-question" @click="toggleFaq(index)">
              {{ faq.question }}
              <svg
                width="16"
                height="16"
                class="faq-arrow"
                :class="{ expanded: faq.expanded }"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L12 15L18 9" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div
              class="faq-answer"
              :class="{ expanded: faq.expanded }"
              :style="{ maxHeight: faq.expanded ? faq.height + 'px' : '0' }"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>

      <!-- 团队介绍 -->
      <div v-if="activeTab === 'team'" class="section">
        <h2 class="section-title">团队介绍</h2>
        <div class="section-content">
          <p>瞬影由一群心怀热爱与奉献的年轻团队创立，我们致力于结合科技与艺术的力量，让每一个运动瞬间都能被完美记录和分享。</p>
        </div>

        <div class="team-list">
          <div class="team-member" v-for="(member, index) in teamMembers" :key="index">
            <div class="member-avatar">
              <img v-if="member.avatar" :src="member.avatar" :alt="member.name">
              <span v-else class="member-placeholder">{{ member.name.charAt(0) }}</span>
            </div>
            <h3 class="member-name">{{ member.name }}</h3>
            <p class="member-role">{{ member.role }}</p>
            <p class="member-desc">{{ member.description }}</p>
          </div>
        </div>

        <h2 class="section-title">特别鸣谢</h2>
        <div class="section-content">
          <p>感谢所有为瞬影平台发展做出贡献的摄影师、技术专家、骑行爱好者和合作伙伴。正是有了你们的支持和反馈，瞬影才能不断成长和完善。</p>
        </div>

        <div class="award-section">
          <div class="award-card">
            <div class="award-ribbon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" fill="#FFD700" stroke="#9966FF" stroke-width="1.5"/>
                <path d="M7 13.5V23L12 20L17 23V13.5" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="award-content">
              <div class="award-header">
                <h3 class="award-title">"像素哲学家"奖</h3>
                <div class="award-recipient">张博文</div>
              </div>
              <div class="award-desc">
                致敬那位在每一个像素背后都能洞见宇宙真理的人
              </div>
              <div class="award-quote">
                "你不是在挑刺，你只是在追问——美的本质到底是什么。"
              </div>
            </div>
          </div>

          <div class="award-card" style="margin-top: 1.5rem;">
            <div class="award-ribbon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" fill="#FFD700" stroke="#9966FF" stroke-width="1.5"/>
                <path d="M7 13.5V23L12 20L17 23V13.5" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 4V5M12 11V12M12 8C12 8 14 8 14 8M8 8H10" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="award-content">
              <div class="award-header">
                <h3 class="award-title">"躺赢布道者金奖"</h3>
                <div class="award-recipient">王泉</div>
              </div>
              <div class="award-desc">
                授予那位——始终稳坐云端，从不下凡干活，却常以神谕左右项目方向的神秘存在。
              </div>
              <div class="award-desc" style="margin-top: 0.5rem;">
                他，不写代码；<br>
                他，不参与会议；<br>
                他从不参与执行，却总能在关键时刻丢下一句话——<br>
              </div>
              <div class="award-title-second"> "你们这样搞不行。&nbsp;&nbsp;&nbsp; "什么？" &nbsp;&nbsp;"让我做？"<br>"不可能"</div>
              <div class="award-quote">
                "你不干活，我们也不敢不听你的。"<br>
                <div class="award-note">此奖项长期有效，每当项目陷入混乱，只需虔诚祈祷，他的智慧之光将照亮前方。</div>
              </div>
            </div>
          </div>

          <div class="award-card" style="margin-top: 1.5rem;">
            <div class="award-ribbon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" fill="#FFD700" stroke="#9966FF" stroke-width="1.5"/>
                <path d="M7 13.5V23L12 20L17 23V13.5" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 8H16M8 5H12M12 12H16" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="award-content">
              <div class="award-header">
                <h3 class="award-title">"沉默代码生成器奖"</h3>
                <div class="award-recipient">王笑天</div>
              </div>
              <div class="award-desc">
                授予：那位话虽不多，但从未缺席的神秘同伴。
              </div>
              <div class="award-desc" style="margin-top: 0.5rem;">
                他不爱说话，却句句在点上；<br>
                他安静、内敛、稳如背景音；<br>
                他从不多言，也几乎不言。
              </div>
              <div class="award-quote">
                "你的沉默，就是你独特的贡献。"<br>
                <div class="award-note">此奖项永久有效——有时最好的代码，是那些从未被说出口的。</div>
              </div>
            </div>
          </div>

          <div class="award-card" style="margin-top: 1.5rem;">
            <div class="award-ribbon">
                <img src="/images/liuhua.svg" alt="UI批判家" style="width: 8rem; height: 100%;">
            </div>
            <div class="award-content">
              <div class="award-header">
                <h3 class="award-title">"UI批判家"勋章</h3>
                <div class="award-recipient">傻篮子二次元</div>
              </div>
              <div class="award-desc">
                授予那位阅(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)无数、审美在线、风格平衡享受者；他不是在批评，他是在传道；他不是在否定，他是在点燃新的灵感。
              </div>
              <div class="award-title-second">荣誉称号：UI 批判家 · 界面风格守门人</div>
              <div class="award-quote">
                "对的对的，哦不对不对，哦对的对的！"<br>
                <small>——某路过的邪王真眼如是说</small><br>
                <div class="award-note">本奖项为永久有效，每当你发出一句"这不太行"时，它便再次闪光。</div>
              </div>
            </div>
          </div>

          <div class="award-card" style="margin-top: 1.5rem;">
            <div class="award-ribbon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" fill="#FFD700" stroke="#9966FF" stroke-width="1.5"/>
                <path d="M7 13.5V23L12 20L17 23V13.5" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 5L16 11M16 5L8 11M6 8H18" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="award-content">
              <div class="award-header">
                <h3 class="award-title">"系统破坏艺术奖"</h3>
                <div class="award-recipient">李浡延</div>
              </div>
              <div class="award-desc">
                授予：那位用令人意想不到的方式，揭示我们项目脆弱性的天才破坏者。
              </div>
              <div class="award-desc" style="margin-top: 0.5rem;">
                当我们以为一切正常时，<br>
                他来了。<br>
                他不是普通用户，他是系统的混乱之源。
              </div>
              <div class="award-desc" style="margin-top: 0.5rem;">
                他用 17 次重复登录试图穿透验证逻辑；<br>
                他用 emoji + 火星文组合打爆输入框；<br>
                他不破坏出 bug，他只是唤醒了 bug 原本就存在的灵魂。
              </div>
              <div class="award-quote">
                "你说他是bug制造机？不——他只是提前体验了项目的死法。"<br>
                <div class="award-note">此奖项将长期有效——直到我们的系统无懈可击（即永远）。</div>
              </div>
            </div>
          </div>

          <div class="award-card" style="margin-top: 1.5rem;">
            <div class="award-ribbon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" fill="#FFD700" stroke="#003366" stroke-width="1.5"/>
                <path d="M7 13.5V23L12 20L17 23V13.5" stroke="#003366" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 5H17M7 9H17M7 13H13" stroke="#003366" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="award-content">
              <div class="award-header">
                <h3 class="award-title" style="color: #003366 ;">"紫色生理性抗拒奖"</h3>
                <div class="award-recipient">ottnroae</div>
              </div>
              <div class="award-desc">
                授予：那位在紫色世界中倔强求生的灵魂个体
              </div>
              <div class="award-desc" style="margin-top: 0.5rem;">
                ta试图远离，但紫色像诅咒一样无处不在；<br>
                ta不是设计师，却对配色有自己坚定的审美；<br>
                ta从不大声反对，只在看见紫色按钮时，默默皱眉。<br>
                ta试图唤醒沉沦在#800080调色板里的我们；
              </div>
              <p style="color: #003366; font-size: 0.92rem; ; margin: 0.5rem;">(ps:应本人要求 改成蓝的)
              </p>
              <div class="award-quote" style="background-color: #00336611;">
                "我们不会改配色，但我们永远记得你曾提醒过我们。"<br>
              <div class="award-note" style="color: #003366">本奖项为永久有效——直到紫色彻底消失。</div>

              </div>
            </div>
          </div>

          <div class="award-card" style="margin-top: 1.5rem;">
            <div class="award-ribbon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" fill="#FFD700" stroke="#9966FF" stroke-width="1.5"/>
                <path d="M7 13.5V23L12 20L17 23V13.5" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 4L8 9M5 6H11M4 12H12" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="award-content">
              <div class="award-header">
                <h3 class="award-title">"人生协议生成器奖"</h3>
                <div class="award-recipient">蜗蜗游</div>
              </div>
              <div class="award-desc">
                授予：那位默默产出隐私政策、用户协议、免责声明的文案执行体
              </div>
              <div class="award-desc" style="margin-top: 0.5rem;">
                他不抖机灵，但每个标点都合法合规。<br>
                他在角落里静静地写下——<br>
                "为保障您的合法权益，我们建议您仔细阅读以下条款..."<br>
                他不是不聪明，他只是以 PDF 的速度在思考。
              </div>
              <div class="award-quote">
                "登录即表示您同意瞬影 用户协议 和 隐私政策"<br>
                <div class="award-note">此奖项永久有效——只要世上仍有需要被阅读但从不被阅读的法律条款。</div>
              </div>
            </div>
          </div>

          <div class="award-card" style="margin-top: 1.5rem;">
            <div class="award-ribbon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" fill="#FFD700" stroke="#9966FF" stroke-width="1.5"/>
                <path d="M7 13.5V23L12 20L17 23V13.5" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 4L8 9M5 6H11M4 12H12" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="award-content">
              <div class="award-header">
                <h3 class="award-title">"理论骑手·零件哲人奖"</h3>
                <div class="award-recipient">陈洪宇</div>
              </div>
              <div class="award-desc">
                授予：那位永远知道该用什么车架、什么坐垫、什么镜头，
                却始终坚守"不骑车也能热爱骑行"的坚定信仰者。
              </div>
              <div class="award-desc" style="margin-top: 0.5rem;">
                他用镜头捕捉骑行者的灵魂，<br>
                他不是不骑车，<br>
                他只是还在等理想中的"终极套件"全部集齐。
              </div>
              <div class="award-quote">
                "你是镜头背后的骑行布道者"<br>
                <div class="award-note">"骑车？不了，谢谢，我爱它就够了。"的最好诠释。</div>
                <div class="award-note" style="margin-top: 0.5rem;">此奖项永久有效——只要还有人懂一切，却从不骑行。</div>
              </div>
            </div>
          </div>

          <div class="award-card" style="margin-top: 1.5rem;">
            <div class="award-ribbon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" fill="#FFD700" stroke="#9966FF" stroke-width="1.5"/>
                <path d="M7 13.5V23L12 20L17 23V13.5" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 5L16 11M16 5L8 11M6 8H18" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="award-content">
              <div class="award-header">
                <h3 class="award-title">"混沌调度者勋章"</h3>
                <div class="award-recipient">QQ</div>
              </div>
              <div class="award-desc">
                授予：混乱与掌控并存，奔忙与不着急同体——
              </div>
              <div class="award-desc" style="margin-top: 0.5rem;">
                他不是在统筹项目，他是在用灵魂搅动命运齿轮；<br>
                他，是那个每三句话就有一句"这个先不急"的人；<br>
                也是那个五分钟后就说"我们现在能不能上线？"的人。
              </div>
              <div class="award-quote">
                "你是最稳定的不确定性，<br>
                你推动大家前进，也顺手把大家带偏。"<br>
                <div class="award-note">"他不是没计划，他只是每次都有三个计划互相打架。"</div>
                <div class="award-note" style="margin-top: 0.5rem;">此奖项永久有效——只要世间仍存在计划与变化的交织。</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户协议 -->
      <div v-if="activeTab === 'terms'" class="section">
        <h2 class="section-title">用户协议</h2>
        <div class="policy-content">
          <div class="policy-section">
            <h3 class="policy-section-title">1. 总则</h3>
            <div class="policy-text">
              <p>1.1 瞬影用户协议（以下简称"本协议"）是由您与瞬影平台（以下简称"本平台"）就瞬影平台服务等相关事宜所订立的契约。</p>
              <p>1.2 您在使用本平台提供的各项服务之前，应仔细阅读本协议。如您不同意本协议或其中任何条款约定，您应立即停止使用本平台服务。一旦您使用本平台服务，即视为您已充分阅读、理解并接受本协议的全部内容。</p>
            </div>
          </div>

          <div class="policy-section">
            <h3 class="policy-section-title">2. 服务内容</h3>
            <div class="policy-text">
              <p>2.1 本平台主要为用户提供骑行摄影照片的搜索、浏览、购买和下载等服务。</p>
              <p>2.2 本平台保留随时变更、中断或终止部分或全部服务的权利。</p>
            </div>
          </div>

          <div class="policy-section">
            <h3 class="policy-section-title">3. 用户账号</h3>
            <div class="policy-text">
              <p>3.1 您在使用本平台服务前需要注册账号。您应当提供真实、准确、完整的个人资料，并在相关信息变更时及时更新。</p>
              <p>3.2 您应妥善保管账号及密码信息，对您账号下的所有行为负责。如发现任何未经授权使用您账号的情况，应立即通知本平台。</p>
            </div>
          </div>

          <div class="policy-section">
            <h3 class="policy-section-title">4. 用户行为规范</h3>
            <div class="policy-text">
              <p>用户在使用本平台服务时应遵守以下行为规范：</p>
              <ul class="policy-list">
                <li>遵守中华人民共和国相关法律法规；</li>
                <li>尊重他人的知识产权和肖像权；</li>
                <li>不发布、传播违法、有害信息；</li>
                <li>不进行任何可能危害平台安全的行为。</li>
              </ul>
            </div>
          </div>

          <div class="policy-section">
            <h3 class="policy-section-title">5. 知识产权</h3>
            <div class="policy-text">
              <p>5.1 本平台上的摄影作品著作权归原摄影师所有。</p>
              <p>5.2 用户购买照片后获得的是照片的使用权，仅限于个人非商业用途使用。任何商业用途使用需另行获得授权。</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 隐私政策 -->
      <div v-if="activeTab === 'privacy'" class="section">
        <h2 class="section-title">隐私政策</h2>
        <div class="policy-content">
          <div class="policy-section">
            <h3 class="policy-section-title">1. 信息收集</h3>
            <div class="policy-text">
              <p>1.1 为了提供服务，我们会收集您的个人信息，包括但不限于：</p>
              <ul class="policy-list">
                <li>注册信息（手机号、昵称等）</li>
                <li>设备信息</li>
                <li>位置信息</li>
                <li>使用记录</li>
                <li>支付信息</li>
              </ul>
              <p>1.2 我们将严格遵守法律法规，保护您的个人信息安全。</p>
            </div>
          </div>

          <div class="policy-section">
            <h3 class="policy-section-title">2. 信息使用</h3>
            <div class="policy-text">
              <p>我们会将收集的信息用于：</p>
              <ul class="policy-list">
                <li>向您提供骑行照片搜索和购买服务</li>
                <li>改进和优化我们的服务和用户体验</li>
                <li>处理支付和订单</li>
                <li>向您发送服务通知和相关信息</li>
                <li>处理您的问题和反馈</li>
              </ul>
            </div>
          </div>

          <div class="policy-section">
            <h3 class="policy-section-title">3. 信息共享</h3>
            <div class="policy-text">
              <p>3.1 除以下情况外，我们不会与第三方共享您的个人信息：</p>
              <ul class="policy-list">
                <li>获得您的明确同意</li>
                <li>为完成交易必要的共享（如支付处理）</li>
                <li>遵守法律法规的要求</li>
                <li>维护本平台及用户的合法权益</li>
              </ul>
            </div>
          </div>

          <div class="policy-section">
            <h3 class="policy-section-title">4. 信息保护</h3>
            <div class="policy-text">
              <p>4.1 我们采取多种安全措施保护您的个人信息，包括数据加密、访问控制等。</p>
              <p>4.2 我们定期评估和更新安全措施，以确保信息安全。</p>
            </div>
          </div>

          <div class="policy-section">
            <h3 class="policy-section-title">5. 用户权利</h3>
            <div class="policy-text">
              <p>您对自己的个人信息拥有以下权利：</p>
              <ul class="policy-list">
                <li>访问和查看个人信息</li>
                <li>更正或更新个人信息</li>
                <li>删除个人信息（在法律允许的范围内）</li>
                <li>撤回同意</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import '@/assets/styles/aboutView.css';

const router = useRouter();

// 选项卡配置
const tabs = [
  { id: 'about', name: '关于瞬影' },
  { id: 'join', name: '加入瞬影' },
  { id: 'contact', name: '联系我们' },
  { id: 'faq', name: '常见问题' },
  { id: 'team', name: '团队介绍' },
  { id: 'terms', name: '用户协议' },
  { id: 'privacy', name: '隐私政策' }
];

// 当前激活的标签页
const activeTab = ref('about');
const tabNavRef = ref<HTMLElement | null>(null);

// 指示器样式
const indicatorStyle = ref({
  width: '0px',
  transform: 'translateX(0px)'
});

// 切换标签页
const switchTab = async (tabId: string) => {
  activeTab.value = tabId;
  await nextTick();
  updateIndicator();
  scrollToActiveTab();
};

// 更新指示器位置
const updateIndicator = () => {
  if (!tabNavRef.value) return;

  const activeTabElement = tabNavRef.value.querySelector('.tab-item.active') as HTMLElement;
  if (activeTabElement) {
    const { width, left } = activeTabElement.getBoundingClientRect();
    const navLeft = tabNavRef.value.getBoundingClientRect().left;

    indicatorStyle.value = {
      width: `${width}px`,
      transform: `translateX(${left - navLeft}px)`
    };
  }
};

// 滚动到选中的选项卡
const scrollToActiveTab = () => {
  if (!tabNavRef.value) return;

  const activeTabElement = tabNavRef.value.querySelector('.tab-item.active') as HTMLElement;
  if (activeTabElement) {
    activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
};

// 监听滚动事件
const handleTabScroll = () => {
  updateIndicator();
};

// 常见问题列表
const faqs = ref([
  {
    question: '我如何查找自己的照片？',
    answer: '您可以通过日期、地点、服装颜色等多种条件筛选照片。平台会自动识别相同骑行者的多张照片并分组，帮助您快速找到自己的所有照片。',
    expanded: false,
    height: 80
  },
  {
    question: '购买照片后可以做什么用途？',
    answer: '购买后的照片可用于个人非商业用途，包括社交媒体分享、个人相册等。如需商业用途，请联系摄影师获取额外授权。',
    expanded: false,
    height: 80
  },
  {
    question: '如何成为瞬影平台的摄影师？',
    answer: '请点击"加入瞬影"选项卡，按照申请流程提交您的基本信息和作品样本。我们的团队会在3-5个工作日内完成审核。',
    expanded: false,
    height: 80
  },
  {
    question: '平台如何保护我的隐私？',
    answer: '我们严格遵守隐私政策，采取数据加密等多种安全措施保护您的个人信息。对于不愿被拍摄的骑行者，可以提出下架申请，我们会及时处理。',
    expanded: false,
    height: 80
  },
  {
    question: '如何联系客服解决问题？',
    answer: '您可以通过应用内的消息中心联系在线客服，或发送邮件至contact@snapmotion.cn。我们的团队会在24小时内回复您的咨询。',
    expanded: false,
    height: 80
  }
]);

// 展开/收起FAQ
const toggleFaq = (index: number) => {
  faqs.value[index].expanded = !faqs.value[index].expanded;
};

// 团队成员
const teamMembers = [
  {
    name: 'QQ',
    role: '创始人 & CEO',
    description: '骑行爱好者，拥有丰富的软件开发、人工智能经验；致力于用热爱与奉献，链接科技与心灵的无限可能。',
    avatar: 'https://via.placeholder.com/80/9966FF/FFFFFF/?text=赵'
  },
  {
    name: '李明',
    role: '技术总监',
    description: '人工智能专家，负责平台的图像识别和智能处理算法，让照片分组和搜索更精准。',
    avatar: 'https://via.placeholder.com/80/9966FF/FFFFFF/?text=李'
  },
  {
    name: '张雨',
    role: '产品设计师',
    description: '专注用户体验设计，热爱摄影与设计，为瞬影打造流畅直观的界面体验。',
    avatar: 'https://via.placeholder.com/80/9966FF/FFFFFF/?text=张'
  },
  {
    name: '王磊',
    role: '市场总监',
    description: '资深营销专家，曾服务多家体育科技企业，负责瞬影的市场推广和摄影师招募。',
    avatar: 'https://via.placeholder.com/80/9966FF/FFFFFF/?text=王'
  }
];

// 申请成为摄影师
const applyAsPhotographer = () => {
  // 在实际项目中，这里应该跳转到申请页面或显示申请表单
  alert('摄影师申请功能即将上线，敬请期待！');
};

onMounted(() => {
  updateIndicator();
  // 监听窗口大小变化和滚动事件，更新指示器位置
  window.addEventListener('resize', updateIndicator);

  if (tabNavRef.value) {
    // 监听滚动事件
    tabNavRef.value.addEventListener('scroll', handleTabScroll, { passive: true });

    // 添加触摸相关事件
    tabNavRef.value.addEventListener('touchend', updateIndicator, { passive: true });
    tabNavRef.value.addEventListener('touchcancel', updateIndicator, { passive: true });
  }
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', updateIndicator);

  if (tabNavRef.value) {
    tabNavRef.value.removeEventListener('scroll', handleTabScroll);
    tabNavRef.value.removeEventListener('touchend', updateIndicator);
    tabNavRef.value.removeEventListener('touchcancel', updateIndicator);
  }
});
</script>
