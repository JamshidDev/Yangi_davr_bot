const { Composer } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
const { I18n, hears } = require("@grammyjs/i18n");
const {
    conversations,
    createConversation,
} = require("@grammyjs/conversations");
const { check_user, register_user, remove_user, set_user_lang } = require("../controllers/userController");
const userService = require("../service/services/userService")

const client_bot = new Composer();
const i18n = new I18n({
    defaultLocale: "uz",
    useSession: true,
    directory: "locales",
    globalTranslationContext(ctx) {
        return { first_name: ctx.from?.first_name ?? "" };
    },
});
client_bot.use(i18n);

const pm = client_bot.chatType("private")

// pm.use(createConversation(back_course_conversation));







// async function back_course_conversation(conversation, ctx) {
//     await ctx.reply(`👇 Kursni tanlang`, {
//         reply_markup: course_list_menu
//     })
//     return;
// }

const library_menu = new Menu("library_menu")
    .dynamic(async (ctx, range) => {
        let list = await ctx.session.session_db.library_list
        list.forEach((item) => {
            range
                .text(item.name, async (ctx) => {
                    await ctx.answerCallbackQuery();
                    await ctx.replyWithDocument(item.file.url_path)


                })
                .row();
        })
    })
pm.use(library_menu)


const course_list_menu = new Menu("course_list_menu")
    .dynamic(async (ctx, range) => {
        let list = await ctx.session.session_db.course_list
        list.forEach((item) => {
            range
                .text(item.titleName, async (ctx) => {
                    await ctx.answerCallbackQuery();
                    await ctx.deleteMessage();
                    const [error, res] = await userService.library_list({ course_id: item.id });
                    if (!error) {
                        ctx.session.session_db.library_list = res.data.data;
                        await ctx.reply(`
<b>📚 Kursga tegishli kitoblar!</b> 

<i>Kitoblarni yuklash uchun kerakli kitob ustiga bosing!</i>
                        `, {
                            parse_mode: "HTML",
                            reply_markup: library_menu
                        })
                    }
                })
                .row();
        })
    })
pm.use(course_list_menu)


pm.command("start", async (ctx) => {
    const [error, res] = await userService.course_list();
    if (!error) {
        ctx.session.session_db.course_list = res.data;
        await ctx.reply(`
<i>👋 Salom <a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name}</a>. Yangi davr ta'lim platformasining rasmiy botiga xush kelibsiz!</i>`, {
            parse_mode: "HTML"
        })
        await ctx.reply(`👇 Kursni tanlang`, {
            reply_markup: course_list_menu
        })
    } else {
        await ctx.reply(`
<b>👋 Salom <a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name}</a>. Yangi davr ta'lim platformasining rasmiy botiga xush kelibsiz!</b>`, {
            parse_mode: "HTML"
        })
    }
})
pm.command('courses', async (ctx) => {
    const [error, res] = await userService.course_list();
    if (!error) {
        ctx.session.session_db.course_list = res.data;
        await ctx.reply(`👇 Kursni tanlang`, {
            reply_markup: course_list_menu
        })
    } else {
        await ctx.reply(`<b>⚠️ Kutilmagan xatolik (🐞 SERVER ERROR!)</b>
        `, {
            parse_mode: "HTML"
        })
    }

})


















































module.exports = { client_bot }