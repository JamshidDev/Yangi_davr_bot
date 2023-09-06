const { Bot, session, MemorySessionStorage, Keyboard, InlineKeyboard, InputFile, InputMediaDocument, InputMediaBuilder } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
const { I18n, hears } = require("@grammyjs/i18n");
const {
    conversations,
    createConversation,
} = require("@grammyjs/conversations");
require('dotenv').config()
const Database = require("./db");
const customLogger = require("./config/customLogger");
const { check_user,register_user, remove_user, set_user_lang } = require("./controllers/userController");



const bot_token = process.env.BOT_TOKEN;
const payme_tokent = process.env.PAYME_PROVIDER_TOKEN;







const bot = new Bot(bot_token);


bot.use(session({
    type: "multi",
    session_db: {
        initial: () => {
            return {
                client: {
                    phone: null,
                    full_name: null,
                },
            }
        },
        storage: new MemorySessionStorage(),
    },
    conversation: {},
    __language_code: {},
}));


const i18n = new I18n({
    defaultLocale: "uz",
    useSession: true,
    directory: "locales",
    globalTranslationContext(ctx) {
        return { first_name: ctx.from?.first_name ?? "" };
    },
});
bot.use(i18n);
bot.use(conversations());

bot.on("my_chat_member", async (ctx) => {
    if (ctx.update.my_chat_member.new_chat_member.status == "kicked") {
        const stats = await ctx.conversation.active();
        for (let key of Object.keys(stats)) {
            await ctx.conversation.exit(key);
        }
        await remove_user(ctx.from.id)
    }

});
// middleware
bot.use(async (ctx, next) => {
    if (false) {
        const stats = await ctx.conversation.active();
        for (let key of Object.keys(stats)) {
            await ctx.conversation.exit(key);
        }
    }
    ctx.config = {
        is_admin: true
    }
    await next()

})


const pm  = bot.chatType("private");












































const language_menu = new Menu("language_menu")
    .dynamic(async (ctx, range) => {
        let list = [{
            name: "language_uz",
            key: "uz"
        },
        {
            name: "language_ru",
            key: "ru"
        }
        ]
        list.forEach((item) => {
            range
                .text(ctx.t(item.name), async (ctx) => {
                    await ctx.answerCallbackQuery();
                    await ctx.i18n.setLocale(item.key);
                    data = {
                        user_id: ctx.from.id,
                        lang: item.key
                    }
                    await set_user_lang(data);
                    await ctx.deleteMessage();
                   
                })
                .row();
        })
    })
pm.use(language_menu)







pm.command("start", async(ctx)=>{

    let lang = await ctx.i18n.getLocale();
    if(!i18n.locales.includes(lang)){
       await ctx.i18n.setLocale("uz");
    }
    let user = await check_user(ctx.from.id);
    data = {
        user_id:ctx.from.id,
        full_name: ctx.from.first_name,
        username: ctx.from.username || null,
        active:true
    }
    if(user){
        await ctx.i18n.setLocale(user.lang);
        data.lang = user.lang;
        await register_user(data);
    }else{
        lang = await ctx.i18n.getLocale()
        data.lang =lang;
        await register_user(data);
    }
    await ctx.reply(ctx.t("start_hello_msg", {
        full_name:ctx.from.first_name,
        organization_name:"Fashion Market"
    }), {
        parse_mode:"HTML",
        reply_markup:language_menu
    })

    
})

















































bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const message = err.error;
    customLogger.log({
        level: 'error',
        message: message
    });
});



bot.start();