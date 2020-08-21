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
}

export default class Validator {
  constructor() {
    this.hooks = []
  }

  get rules () {
    return ValidatorRules
  }

  init(){
    if(this.hooks.length) {
      this.hooks = []
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
      const args = rule.type.split(':')

      this.hooks.push(() => {
        const type = args.shift()
        args.unshift(value)
        args.push(rule.message)

        if (this.rules[type]) {
          return this.rules[type].apply(null, args)
        } else if(rule.callback) {
          return rule.callback.apply(null, args)
        }
      })
    }
    return this
  }

  /**
   * 执行添加的验证项
   * @returns {*}
   */
  validation(callback) {
    for (const validatorFunc of this.hooks) {
      const errorMsg = validatorFunc()
      if (errorMsg) {
        if(callback) {
          return callback(errorMsg)
        }
        return errorMsg
      }
    }
    if (callback) {
      return callback()
    }
  }

  start(rules, callback) {
    if(this.hooks.length) {
      this.hooks = []
    }
    rules.forEach(item => {
      this.add(item.value, item.rules)
    })
    this.validation(callback)
    return this
  }
}
