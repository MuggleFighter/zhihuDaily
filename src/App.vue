<template>
  <div class="daily">
    <div class="daily-menu">
      <!-- 每日推荐 -->
      <div class="daily-menu-item"
           :class="{on: type==='recommend'}"
           @click="handleToRecommend">每日推荐
      </div>
      <!-- 主题日报 -->
      <div class="daily-menu-item"
           @click="showThemes = !showThemes"
           :class="{on: type==='daily'}">主题日报
      </div>
      <!-- 主题列表 -->
      <ul v-show="showThemes">
        <li v-for="item in themes" :key="item.id">
          <a href="#" :class="{on: item.id === themeId && type === 'daily'}" @click="handleToTheme(item.id)">{{item.name}}</a>
        </li>
      </ul>
    </div>
    <div class="daily-list" @scroll="handleScroll" ref="list">
      <!-- 推荐列表项目 -->
      <template v-if="type === 'recommend'">
        <div v-for="list in recommendList" :key="list.date">
          <!-- 在模板中使用methods的方法 -->
          <div class="daily-date">{{formatDay(list.date)}}</div>
          <Item v-for="item in list.stories"
                :data="item"
                :key="item.id"
                @click.native="handleClick(item.id)"
                :class="{on:item.id === articleId}"></Item>
        </div>
      </template>
      <!-- 主题日报列表项目    -->
      <template v-else-if="type === 'daily'">
        <Item v-for="item in list"
              :data="item"
              :key="item.id"
              @click.native="handleClick(item.id)"
              :class="{on:item.id === articleId}"></Item>
      </template>
      <!-- 加载时的转动图标 -->
      <div class="list-loading" v-show="isLoading"></div>
    </div>
    <!-- 文章详情 -->
    <daily-article :id="articleId"></daily-article>
  </div>
</template>

<script>
import $ from "./assets/util";
import Item from "./components/item";
import dailyArticle from "./components/daily-article";

export default {
  name: "App",
  components: {
    Item,
    dailyArticle
  },
  data() {
    return {
      themes: [],
      showThemes: false,
      type: "recommend",
      themeId: 0,
      list: [],
      isLoading: false,
      recommendList: [],
      dailyTime: $.getTodayTime(),
      articleId: 0,
      firstLoading: true
    };
  },
  methods: {
    getThemes() {
      $.ajax.get("themes").then(res => (this.themes = res.others));
    },
    handleToTheme(id) {
      this.type = "daily"; //切换类型
      this.themeId = id; //标记被点击项目,用于判断是否需要加on的css类
      this.list = []; //清空日报列表,便于显示loading图标
      this.isLoading = true;
      $.ajax.get(`theme/${id}`).then(res => {
        this.list = res.stories.filter(item => item.type !== 1);
        this.isLoading = false;
      });
    },
    handleToRecommend() {
      this.type = "recommend";
      this.recommendList = [];
      this.dailyTime = $.getTodayTime();
      this.getRecommendList();
    },
    getRecommendList() {
      this.isLoading = true;
      const prevDay = $.prevDay(this.dailyTime + 86400000);
      $.ajax.get("news/before/" + prevDay).then(res => {
        this.recommendList.push(res);
        this.isLoading = false;
        //初次载入页面时加载第一篇文章
        if (this.firstLoading) {
          this.articleId = this.recommendList[0].stories[0].id;
          this.firstLoading = false;
        }
      });
    },
    formatDay(time) {
      //返回的数据有date字段,直接使用,注意不能直接使用Date.getTime(),因为推荐列表有可能还未更新
      const year = time.substr(0, 4);
      const month = time.substr(4, 2);
      const date = time.substr(6, 2);
      const day = $.getDay(new Date(`${year}-${month}-${date}`).getTime());
      return `${year}年 ${month}月 ${date}日 星期${day}`;
    },
    handleScroll() {
      const $list = this.$refs.list;
      if (this.type === "daily" || this.isLoading) return;
      if ($list.scrollTop + document.body.clientHeight >= $list.scrollHeight) {
        this.dailyTime -= 86400000;
        this.getRecommendList();
      }
    },
    handleClick(id) {
      //异步获取文章的详细代码在组件中,其实也可以写在这里,然后把获取的数据传递给子组件即可.
      this.articleId = id;
    }
  },
  mounted() {
    this.getThemes();
    this.getRecommendList();
  }
};
</script>

<style>
</style>
