import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, {router, store, localVue});

    it('renders the correct number of posts', function () {
        const posts = wrapper.findAll(".post")
        expect(posts.length).toEqual(testData.length)
    });

    it('renders media properties correctly', function () {
        const displayedPosts = wrapper.findAll(".post")
        for (let i = 0; i < displayedPosts.length; i++) {
            let displayedPost = displayedPosts.at(i)
            let post = testData[i]
            if (post.media) {
                if (post.media.type === 'image'){
                    //console.log(displayedPost.find('.post-image').find('img').exists());
                    expect(displayedPost.find('.post-image').find('img').exists()).toBe(true)
                }
                else if (post.media.type === 'video'){
                    expect(displayedPost.find('.post-image').find('video').exists()).toBe(true)
                }
            } else {
                //console.log(post.media);
                //console.log(post.id);
                //console.log(displayedPost.find('.post-image').exists());
                //console.log(displayedPost.find('img').attributes());
                expect(displayedPost.find('.post-image').exists()).toBe(false)
            }
        }
    })

    it('shows date in correct format', function () {
        const date = "2020-12-05 13:53:23"
        const newDate = wrapper.vm.$options.filters.formatDate(date)
        expect(newDate).toEqual("Saturday, December 5, 2020 1:53 PM")
    })
});