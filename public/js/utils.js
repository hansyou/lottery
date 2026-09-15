/**
 * 工具函数模块
 * 提供通用的辅助函数
 */
const LotteryUtils = {
    /**
     * 获取 DOM 元素
     * @param {string} id
     * @returns {HTMLElement}
     */
    $(id) {
        return document.getElementById(id);
    },

    /**
     * 获取所有匹配的 DOM 元素
     * @param {string} selector
     * @returns {NodeList}
     */
    $$(selector) {
        return document.querySelectorAll(selector);
    },

    /**
     * 显示元素
     * @param {HTMLElement} element
     */
    show(element) {
        if (element) {
            element.style.display = 'block';
        }
    },

    /**
     * 隐藏元素
     * @param {HTMLElement} element
     */
    hide(element) {
        if (element) {
            element.style.display = 'none';
        }
    },

    /**
     * 加载 HTML 片段
     * @param {string} url
     * @returns {Promise<string>}
     */
    async loadHTML(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load ${url}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Error loading HTML: ${url}`, error);
            return '';
        }
    },

    /**
     * 创建庆祝彩带动画
     */
    createCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        document.body.appendChild(celebration);

        const colors = ['#ff6b9d', '#ffa07a', '#ffd700', '#4caf50', '#2196f3', '#9c27b0'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
            celebration.appendChild(confetti);
        }

        // 3秒后移除庆祝效果
        setTimeout(() => {
            celebration.remove();
        }, 4000);
    },

    /**
     * 随机数组洗牌 (Fisher-Yates)
     * @param {Array} array
     * @returns {Array}
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * 获取随机元素
     * @param {Array} array
     * @returns {*}
     */
    randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
};
