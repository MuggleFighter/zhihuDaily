<template>
  <div class="daily-article">
    <div class="loading-modal" v-show="isLoading">
      <div class="loading-icon"></div>
    </div>
    <div class="img-place-holder" :style="getTitleImg" v-show="data.image">
      <div class="daily-article-title">{{data.title}}</div>
    </div>
    <div v-html="data.body"></div>

    <div class="daily-comments" v-show="comments.length">
      <span>评论({{comments.length}})</span>
      <div class="daily-comment" v-for="comment in comments" :key="comment.id">
        <div class="daily-comment-avatar"><img :src="comment.avatar" alt=""></div>
        <div class="daily-comment-content">
          <div class="daily-comment-name">{{comment.author}}</div>
          <div class="daily-comment-time" v-time="comment.time"></div>
          <div class="daily-comment-text">{{comment.content}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "../assets/util";
import Time from "../assets/directives/time";
import axios from "axios";

export default {
  name: "daily-article",
  directives: {
    Time
  },
  props: {
    id: {
      type: Number
    }
  },
  data() {
    return {
      data: {},
      comments: [],
      isLoading: false,
      CancelToken: axios.CancelToken,
      cancel: null
    };
  },
  methods: {
    getArticle() {
      //如果文章正在加载,取消请求,防止频繁切换文章,文章内容与左侧列表不对应的问题
      if (this.isLoading) this.cancel();
      this.isLoading = true;
      //加载时禁止滚动
      document.body.style.overflow = "hidden";
      //因为data和comments在下面重新赋值了,所以不用清空数据
      // this.data = {}
      // this.comments = []
      $.ajax
        .get("news/" + this.id, {
          cancelToken: new this.CancelToken(c => {
            this.cancel = c;
          })
        })
        .then(res => {
          //走代理
          res.body = res.body.replace(/src="http/g, `src="${$.imgPath}http`);
          res.body = res.body.replace(/src="https/g, `src="${$.imgPath}https`);
          //删除标题图
          res.body = res.body.replace(
            /<div class="img-place-holder"><\/div>/,
            ""
          );
          //重新赋值
          this.data = res;
          //改变状态
          this.isLoading = false;
          // 获取文章后返回顶端
          window.scrollTo(0, 0);
          //恢复为可以滚动的状态
          document.body.style.overflow = "auto";
        })
        .catch(thrown => {
          //参考官方文档
          if (axios.isCancel(thrown)) {
            // this.isLoading = false
            console.log("Request canceled", thrown.message);
          }
        });
    },
    getComments() {
      $.ajax.get(`story/${this.id}/short-comments`).then(res => {
        this.comments = res.comments.map(comment => {
          comment.avatar = $.imgPath + comment.avatar;
          return comment;
        });
      });
    }
    //每篇文章css基本一样,所以直接复制作为本地文件
    // getCSS(res) {
    //   // this.$nextTick(() => {
    //   //   const css = document.createElement('link')
    //   //   css.href = res.css[0]
    //   //   css.rel = 'stylesheet'
    //   //   document.head.appendChild(css)
    //   // })
    // },
    //上面直接替换了该元素,所以这里注释掉
    // getTitleImg(res) {
    //   // this.$nextTick(() => {
    //     const titleImg = document.querySelector('.img-place-holder')
    //     res.image = res.image || res.images[0]
    //     res.image = res.image.replace(/(https|http)/, `${$.imgPath}https`)
    //     titleImg.style = `background: url("${res.image}") center center;position:relative`
    //   // })
    // }
  },
  computed: {
    //样式判断较复杂,写到computed属性里
    getTitleImg() {
      //直接访问this.data.image || this.data.images 可能会出错,需要先判断
      if (this.data.image || this.data.images) {
        let imageURL = this.data.image || this.data.images[0];
        imageURL = $.imgPath + imageURL;
        return { background: `url(${imageURL}) center center` };
      }
    }
  },
  watch: {
    id(val) {
      if (val) {
        //id变化时获取文章
        this.getArticle();
        //同时获取评论
        this.getComments();
      }
    }
  }
};
</script>
