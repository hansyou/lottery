/**
 * 状态管理模块
 * 管理全局抽奖状态
 */
const LotteryState = {
    // 当前抽奖状态
    title: '',
    participants: [],
    prizes: [],
    currentPrizeIndex: 0,
    currentPrizeWinners: [],
    allResults: [],
    isRolling: false,

    /**
     * 重置状态
     */
    reset() {
        this.title = '';
        this.participants = [];
        this.prizes = [];
        this.currentPrizeIndex = 0;
        this.currentPrizeWinners = [];
        this.allResults = [];
        this.isRolling = false;
    },

    /**
     * 获取当前奖项
     * @returns {Object|null}
     */
    getCurrentPrize() {
        if (this.currentPrizeIndex < this.prizes.length) {
            return this.prizes[this.currentPrizeIndex];
        }
        return null;
    },

    /**
     * 获取所有已中奖的参与者
     * @returns {Array}
     */
    getAllWinners() {
        const winners = [];
        for (const prize of this.prizes) {
            winners.push(...prize.winners);
        }
        return winners;
    },

    /**
     * 获取可参与抽奖的参与者
     * @returns {Array}
     */
    getAvailableParticipants() {
        const allWinners = this.getAllWinners();
        return this.participants.filter(name => !allWinners.includes(name));
    },

    /**
     * 检查是否还有下一个奖项
     * @returns {boolean}
     */
    hasNextPrize() {
        return this.currentPrizeIndex < this.prizes.length - 1;
    },

    /**
     * 移动到下一个奖项
     */
    nextPrize() {
        this.currentPrizeIndex++;
        this.currentPrizeWinners = [];
    }
};
