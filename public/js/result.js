/**
 * 结果面板模块
 * 处理结果显示和下载
 */
const LotteryResult = {
    /**
     * 初始化结果面板
     */
    init() {
        this.bindEvents();
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        const downloadBtn = LotteryUtils.$('downloadBtn');
        const restartBtn = LotteryUtils.$('restartBtn');

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadResults());
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restart());
        }
    },

    /**
     * 显示结果
     */
    showResults() {
        // 保存结果
        LotteryState.allResults = LotteryState.prizes.map(prize => ({
            name: prize.name,
            winners: [...prize.winners]
        }));

        // 更新标题
        const resultTitle = LotteryUtils.$('resultTitle');
        if (resultTitle) {
            resultTitle.textContent = LotteryState.title + ' - 抽奖结果';
        }

        // 渲染结果
        const resultContent = LotteryUtils.$('resultContent');
        if (!resultContent) return;

        resultContent.innerHTML = '';

        for (const result of LotteryState.allResults) {
            const section = document.createElement('div');
            section.className = 'result-section';

            let winnersHtml = '';
            if (result.winners.length > 0) {
                winnersHtml = result.winners
                    .map(name => `<span class="winner">${name}</span>`)
                    .join('');
            } else {
                winnersHtml = '<span class="no-winners">无中奖者</span>';
            }

            section.innerHTML = `
                <h3>🏆 ${result.name}</h3>
                <div class="winners">${winnersHtml}</div>
            `;

            resultContent.appendChild(section);
        }

        // 庆祝效果
        LotteryUtils.createCelebration();
    },

    /**
     * 下载结果
     */
    downloadResults() {
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN');

        let content = `${'='.repeat(50)}\n`;
        content += `        ${LotteryState.title}\n`;
        content += `        抽奖结果\n`;
        content += `${'='.repeat(50)}\n\n`;
        content += `抽奖时间：${timeString}\n`;
        content += `参与人数：${LotteryState.participants.length}人\n\n`;
        content += `${'─'.repeat(50)}\n\n`;

        for (const result of LotteryState.allResults) {
            content += `【${result.name}】\n`;
            if (result.winners.length > 0) {
                result.winners.forEach((name, index) => {
                    content += `  ${index + 1}. ${name}\n`;
                });
            } else {
                content += `  无中奖者\n`;
            }
            content += '\n';
        }

        content += `${'─'.repeat(50)}\n`;
        content += `参与人员完整名单：\n`;
        LotteryState.participants.forEach((name, index) => {
            content += `  ${index + 1}. ${name}\n`;
        });
        content += `\n${'='.repeat(50)}\n`;

        // 创建下载
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'result.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * 重新开始
     */
    restart() {
        if (confirm('确定要重新开始吗？当前结果将丢失。')) {
            LotteryState.reset();
            LotterySetup.reset();
            LotteryMain.switchPanel('setup');
        }
    }
};
