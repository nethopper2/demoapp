<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <hr>
    <h2>You have reached the frontend</h2>
    <p>
      ... running in a Kubernetes cluster named <b>{{ myClusterName}}</b>
    </p>
    <hr>
    <h2>{{ backendString1 }}</h2>

    <p v-if = foundBackend>
      ... running in a Kubernetes cluster named <b>{{ backendClusterName }}</b>
    </p>
    <hr>
    <p>Running counter {{ count }} </p>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'cox',
  props: {
    msg: String
  },
  data () {
    return {
      myClusterName: 'not found',
      backendString1: "",
      backendString2: "",
      foundBackend: false,
      backendRequestStatus: 400,
      backendResponse: undefined,
      backendClusterName: 'not found',
      count: 0
    }
  },
  computed: {
  },
  methods: {
    // method1 () {
    //   this.clusterName = process.env.CLUSTERNAME
    // },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  },
  components: {
  },
  async mounted () {
    // console.log("env", process.env)
    // axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    // axios({ method: "GET", "url": "https://www.nethopper.io/", headers: {} }).then(result => {
    //   this.backendRequestStatus = result.status
    //   console.log('this.backendRequestStatus', this.backendRequestStatus)
    // }, error => {
    //   console.error(error)
    // })
    // console.log("env", process.env)

    this.count = 0
    // eslint-disable-next-line no-constant-condition
    while (true) {
      axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
      axios({ method: "GET", "url": "/api", headers: {} }).then(result => {
        this.backendRequestStatus = result.status
        console.log('result', result)
        if (result.data.myClusterName) {
          this.myClusterName = result.data.myClusterName
        } else {
          this.myClusterName = "not found"
        }
        if (result.data.backendClusterName && result.data.backendClusterName != "not found") {
          this.backendClusterName = result.data.backendClusterName
          this.foundBackend = true
        } else {
          this.backendClusterName = "not found"
          this.foundBackend = false
        }
        // console.log('this.backendRequestStatus', this.backendRequestStatus)
        // console.log('result', result)
      }, error => {
        console.error(error)
      })
      this.count = this.count + 1
      // console.log('process.env', process.env)
      if (this.foundBackend == true) {
        this.backendString1 = "It is connected to a backend"
        this.backendString2 = "... running in a Kubernetes cluster named ".concat(this.backendClusterName)
      } else {
        this.backendString1 = "It is NOT connected to a backend"
      }
      await this.sleep(1000)
    }
  }
}
</script>

