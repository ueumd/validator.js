# validator 
- 轻量极小简单的JavaScript表单验证，字符串验证，无依赖
- 可自定义验证规则

## 安装使用

### 模块

## 客户端使用

```js
import Validator from '../dist/validator.esm.js'
const validator = new Validator()
```

在JS中使用方法。
> 详细见Demo

```html
<script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.js"></script>

<body id="app">
  <div class="form-group">
    <label>手机号码:</label>
    <label>
      <input type="text" v-model="phone" class="form-control" />
    </label>
  </div>

  <div class="form-group">
    <label>请输入用户名:</label>
    <label>
      <input type="text" v-model="username" class="form-control">
    </label>
  </div>

  <button @click="check" class="btn">Submit</button>
</body>

<script type="text/javascript">
  const validate = new Validator()
  
new Vue({
    data(){
        return {
            phone:'',
            username: ''
        }
    },
    methods: {
        check(){
            validate
                .start()
                .add(this.phone, [
                    {
                        name: 'requried',
                        message:'手机号码不能为空'
                    }，
                    {
                        name: 'phone',
                        message:'手机号码格式不正确'
                    }
                ])
                .add(this.username, [
                    {
                        name: 'requried',
                        message:'用户名不能为空'
                    }，
                    {
                        name: 'min:6',
                        message:'用户名长度不能小于6位!'
                    }
                ])
            
            const errorMsg = validate.validation()
            if (errorMsg) {
              console.error(errorMsg)
            } else {}
        }
    }
})
</script>
```

## 说明文档

### new Validator() 
构造器

### new Validator().add(value, rules)
参数说明
- value 需要验证的值
- rules
    - `name` -> input 中 `name` 对应的值
    - `messages` -> 验证错误要提示的文字
    - `rules` -> 一个或多个规则(中间用`|`间隔)
        - `required` -> 必填项
        - `min:0` -> 最小长度
        - `max:0` -> 最大长度
        - `phone` -> 验证手机
        - `email` -> 验证Email
        
```js
validate.add(this.username, [
    {name: 'required', message: '用户名不能为空'},
    {name: 'min:6', message: '用户名长度不能小于6位!'}
])
```

### new Validator().start(rules, callback)
> 回调函数方式

- rules 数组，需要验证的字段项
```js
    [
        {
            value: this.phone,
            rules: [{name: 'phone', message: '手机号码格式不正确'}]
        },
        {
            value: this.password,
            rules: [
             {name: 'required', message: '密码不能为空!'},
             {name: 'max:8', message: '密码长度不能超过8位'},
             {name: '@', message: '必须包含@符号！'}
            ]
        }
    ]
```

- callback 成功与失败回调函数
```js
(err) => {
      if (err) {
        console.error(err)
      } else {
        console.log('ok')
      }
}
```

### 添加全局验证
```js
validate.rules['@'] = (value, message) => {
    return ~value.indexOf('@') === 0 ? message : void 0
}

// 使用1
validate.init().add(this.password, [{name:'@', message:'必须包含@符号!'}])
const errorMsg = validate.validation()
if (errorMsg) {
  console.error(this.errorMsg)
} else {
  console.log('ok')
}

// 使用2
validate.start(
    [
      {
        value: this.phone,
        rules: [{name: 'phone', message: '手机号码格式不正确'}]
      },
      {
        value: this.username,
        rules: [
          {name: 'required', message: '用户名不能为空！'},
          {name: 'min:6', message: '用户名长度不能小于6位！'},
          {
            name: 'callback',
            message: '用户名必须是英文字母！',
            callback: (value, message) => {
              return !/^[A-Za-z]+$/.test(value) ? message : void 0
            }
          }
        ]
      },
      {
        value: this.password,
        rules: [
          {name: 'required', message: '密码不能为空!'},
          {name: 'max:8', message: '密码长度不能超过8位'},
          {name: '@', message: '必须包含@符号！'}
        ]
      }
    ],
    (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log('ok')
      }
    }
)

```


### 自定义
自定义验证:
- name: 'callback'
- message: '提示信息'
- callback: (value, message) => {...}
```js
 validate.init().add(this.password, [
  {
    name: 'callback',
    message: '密码不能为空!',
    callback :(value, message) =>  {
      return value === '' ? message : void 0
    }
  },
  {
    name: 'callback',
    message: '必须包含@符号！',
    callback :(value, message) =>  {
      return ~value.indexOf('@') === 0 ? message : void 0
    }
  }
])
```

## 参考
- [chriso/validator.js](https://github.com/chriso/validator.js)
- [rickharrison/validate.js](https://github.com/rickharrison/validate.js)
