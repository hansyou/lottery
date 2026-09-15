/**
 * 抽奖逻辑模块
 * 处理抽奖动画和中奖逻辑
 */
const LotteryRoller = {
    rollInterval: null,

    /**
     * 初始化抽奖面板
     */
    init() {
        this.bindEvents();
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        const rollBtn = LotteryUtils.$('rollBtn');
        const nextPrizeBtn = LotteryUtils.$('nextPrizeBtn');
        const finishBtn = LotteryUtils.$('finishBtn');

        if (rollBtn) {
            rollBtn.addEventListener('click', () => this.roll());
        }

        if (nextPrizeBtn) {
            nextPrizeBtn.addEventListener('click', () => this.nextPrize());
        }

        if (finishBtn) {
            finishBtn.addEventListener('click', () => LotteryMain.switchPanel('result'));
        }
    },

    /**
     * 加载当前奖项信息
     */
    loadCurrentPrize() {
        const prize = LotteryState.getCurrentPrize();
        if (!prize) return;

        const currentPrizeName = LotteryUtils.$('currentPrizeName');
        const remainingCount = LotteryUtils.$('remainingCount');
        const winnersList = LotteryUtils.$('winnersList');
        const nameRoller = LotteryUtils.$('nameRoller');
        const rollBtn = LotteryUtils.$('rollBtn');
        const nextPrizeBtn = LotteryUtils.$('nextPrizeBtn');
        const finishBtn = LotteryUtils.$('finishBtn');
        const lotteryTitle = LotteryUtils.$('lotteryTitle');

        // 更新标题
        if (lotteryTitle) lotteryTitle.textContent = LotteryState.title;

        // 更新奖项信息
        if (currentPrizeName) currentPrizeName.textContent = prize.name;
        if (remainingCount) remainingCount.textContent = prize.quantity;

        // 清空中奖名单显示
        if (winnersList) winnersList.innerHTML = '';
        LotteryState.currentPrizeWinners = [];

        // 重置滚轮
        if (nameRoller) {
            nameRoller.innerHTML = '<span>准备开始</span>';
            nameRoller.classList.remove('rolling');
        }

        // 显示/隐藏按钮
        LotteryUtils.show(rollBtn);
        LotteryUtils.hide(nextPrizeBtn);
        LotteryUtils.hide(finishBtn);
    },

    /**
     * 开始抽奖
     */
    roll() {
        if (LotteryState.isRolling) return;

        const prize = LotteryState.getCurrentPrize();
        if (!prize) return;

        const remaining = prize.quantity - LotteryState.currentPrizeWinners.length;
        if (remaining <= 0) {
            alert('本轮抽奖已完成！');
            return;
        }

        const available = LotteryState.getAvailableParticipants();
        if (available.length === 0) {
            alert('没有可用的参与者了！');
            return;
        }

        // 开始滚动
        LotteryState.isRolling = true;
        const rollBtn = LotteryUtils.$('rollBtn');
        if (rollBtn) {
            rollBtn.disabled = true;
            rollBtn.textContent = '抽奖中...';
        }

        const nameRoller = LotteryUtils.$('nameRoller');
        if (nameRoller) nameRoller.classList.add('rolling');

        // 快速切换名字动画
        let count = 0;
        const totalRolls = 20 + Math.floor(Math.random() * 10);
        const baseInterval = 50;

        const animate = () => {
            const randomIndex = Math.floor(Math.random() * available.length);
            if (nameRoller) {
                nameRoller.innerHTML = `<span>${available[randomIndex]}</span>`;
            }

            count++;

            if (count < totalRolls) {
                const delay = baseInterval + (count * 10);
                setTimeout(animate, delay);
            } else {
                // 最终选择
                this.selectWinner(available);
            }
        };

        animate();
    },

    /**
     * 选择中奖者
     * @param {Array} available - 可选参与者列表
     */
    selectWinner(available) {
        const nameRoller = LotteryUtils.$('nameRoller');
        const rollBtn = LotteryUtils.$('rollBtn');
        const nextPrizeBtn = LotteryUtils.$('nextPrizeBtn');
        const finishBtn = LotteryUtils.$('finishBtn');
        const winnersList = LotteryUtils.$('winnersList');
        const remainingCount = LotteryUtils.$('remainingCount');

        // 随机选择中奖者
        const winnerIndex = Math.floor(Math.random() * available.length);
        const winner = available[winnerIndex];

        // 显示最终结果
        if (nameRoller) {
            nameRoller.innerHTML = `<span style="color: #4caf50;">${winner}</span>`;
            nameRoller.classList.remove('rolling');
        }

        // 记录中奖者
        const prize = LotteryState.getCurrentPrize();
        prize.winners.push(winner);
        LotteryState.currentPrizeWinners.push(winner);

        // 显示中奖标签
        if (winnersList) {
            const tag = document.createElement('span');
            tag.className = 'winner-tag';
            tag.textContent = winner;
            winnersList.appendChild(tag);
        }

        // 更新剩余数量
        const newRemaining = prize.quantity - LotteryState.currentPrizeWinners.length;
        if (remainingCount) remainingCount.textContent = newRemaining;

        // 恢复按钮状态
        LotteryState.isRolling = false;
        if (rollBtn) {
            rollBtn.disabled = false;
            rollBtn.textContent = '🎲 抽奖';
        }

        // 检查是否完成本轮
        if (newRemaining <= 0) {
            LotteryUtils.hide(rollBtn);

            if (LotteryState.hasNextPrize()) {
                LotteryUtils.show(nextPrizeBtn);
            } else {
                LotteryUtils.show(finishBtn);
            }
        }
    },

    /**
     * 下一个奖项
     */
    nextPrize() {
        LotteryState.nextPrize();
        this.loadCurrentPrize();
    }
};
