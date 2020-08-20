'use strict';

/*
 * String validation
 * https://github.com/ueumd/validator.js
 */
const ValidatorRules = {
  required(value, errorMsg) {
    return value === '' ? errorMsg : void 0
  },
  min(value, length, errorMsg) {
    return value.length < length ? errorMsg : void 0
  },
  max(value, length, errorMsg) {
    return value.length > length ? errorMsg : void 0
  },
  phone(value, errorMsg) {
    return !/^1([35789])[0-9]{9}$/.test(value) ? errorMsg : void 0
  },
  email(value, errorMsg) {
    return !/^\w+([+-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value) ? errorMsg : void 0
  }
};

class Validator {
  constructor() {
    this.hooks = [];
  }

  get rules () {
    return ValidatorRules
  }

  init(){
    if(this.hooks.length) {
      this.hooks = [];
    }
    return this
  }
  /**
   * 添加验证项
   * @param value 需要验证的值
   * @param rules 验证规则
   * @returns {Validator}
   */
  add(value, rules) {
    for (const rule of rules) {
      const strategyAry = rule.name.split(':');

      this.hooks.push(() => {
        const ruleKey = strategyAry.shift();
        strategyAry.unshift(value);
        strategyAry.push(rule.message);

        if (this.rules[ruleKey]) {
          return this.rules[ruleKey].apply(null, strategyAry)
        } else if(rule.callback) {
          return rule.callback.apply(null, strategyAry)
        }
      });
    }
    return this
  }

  /**
   * 执行添加的验证项
   * @returns {*}
   */
  check(fn) {
    for (const validatorFunc of this.hooks) {
      const errorMsg = validatorFunc();
      if (errorMsg) {
        if(fn) {
          return fn(errorMsg)
        }
        return errorMsg
      }
    }
    if (fn) {
      return fn()
    }
  }

  start(items, fn) {
    if(this.hooks.length) {
      this.hooks = [];
    }
    items.forEach(item => {
      this.add(item.value, item.rules);
    });
    this.check(fn);
    return this
  }
}

module.exports = Validator;
