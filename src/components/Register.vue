<template>
  <div class="reg-layout">
    <div class="reg-logo"><img src="../assets/image/logo-mediu.png" alt="logo"></div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="Name" prop="name">
            <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
        </FormItem>
        <FormItem label="login" prop="login">
            <Input v-model="formValidate.login" placeholder="Enter your login"></Input>
        </FormItem>
        <FormItem label="password" prop="password">
            <Input type="password" v-model="formValidate.password" placeholder="Enter your password"></Input>
        </FormItem>
        <FormItem label="passwordAgin" prop="passwordAgin">
            <Input v-model="formValidate.passwordAgin" placeholder="Enter your passwordAgin"></Input>
        </FormItem>
        <FormItem label="E-mail" prop="mail">
            <Input v-model="formValidate.mail" placeholder="Enter your e-mail"></Input>
        </FormItem>
        <FormItem label="City" prop="city">
            <Select v-model="formValidate.city" placeholder="Select your city">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
            </Select>
        </FormItem>
        <FormItem label="Date">
            <Row>
                <Col span="11">
                    <FormItem prop="date">
                        <DatePicker type="date" placeholder="Select date" v-model="formValidate.date"></DatePicker>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                    <FormItem prop="time">
                        <TimePicker type="time" placeholder="Select time" v-model="formValidate.time"></TimePicker>
                    </FormItem>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="Gender" prop="gender">
            <RadioGroup v-model="formValidate.gender">
                <Radio label="male">Male</Radio>
                <Radio label="female">Female</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="Hobby" prop="interest">
            <CheckboxGroup v-model="formValidate.interest">
                <Checkbox label="Eat"></Checkbox>
                <Checkbox label="Sleep"></Checkbox>
                <Checkbox label="Run"></Checkbox>
                <Checkbox label="Movie"></Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="Desc" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  name: 'Register',
  data () {
    return {
      formValidate: {
        loginName: '',
        name: '',
        password: '',
        passwordAgin: ''
        // mail: '',
        // city: '',
        // gender: '',
        // interest: [],
        // date: '',
        // time: '',
        // desc: ''
      },
      ruleValidate: {
        login: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        name: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        password: [
          {type: 'string', message: 'incorrect password ', trigger: 'blur'},
          {required: true, message: 'password cannot be empty', trigger: 'lbur'}
        ],
        passwordAgin: [
          {type: 'string', message: 'incorrect password ', trigger: 'blur'},
          {required: true, message: 'password cannot be empty', trigger: 'lbur'}
        // ],
        // mail: [
        //   { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
        //   { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
        // ],
        // city: [
        //   { required: true, message: 'Please select the city', trigger: 'change' }
        // ],
        // gender: [
        //   { required: true, message: 'Please select gender', trigger: 'change' }
        // ],
        // interest: [
        //   { required: true, type: 'array', min: 1, message: 'Choose at least one hobby', trigger: 'change' },
        //   { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
        // ],
        // date: [
        //   { required: true, type: 'date', message: 'Please select the date', trigger: 'change' }
        // ],
        // time: [
        //   { required: true, type: 'string', message: 'Please select time', trigger: 'change' }
        // ],
        // desc: [
        //   { required: true, message: 'Please enter a personal introduction', trigger: 'blur' },
        //   { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      const that = this;
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.$refs[name].model.password === this.$refs[name].model.passwordAgin) {
            this.$http({
              url: 'http://localhost:8009/user/user/add',
              method: 'POST',
              data: JSON.stringify({login: this.$refs[name].model.login, name: this.$refs[name].model.name, password: this.$refs[name].model.password}),
              headers: {'Content-Type': 'application/json;charset=utf-8'}
            })
              .then(function (res) {
                if (res.status === 200) {
                  alert(res.data.messege);
                  that.$router.push('/login');
                } else {
                  alert(res.data.messege);
                  that.$router.push('/register');
                }
              }).catch(function () {
                this.$Message.error('添加错误');
              })
          } else {
            this.$Message.error('密码不一致!');
          }
        } else {
          this.$Message.error('Fail!');
        }
      });
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    }
  }
}
</script>
<style lang="less" scoped>
.reg-layout {
  width: 300px;
  margin: 0 auto;
}
.reg-logo {
  height: 80px;
}
</style>
