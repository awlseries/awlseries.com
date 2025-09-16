// Перевод страницы регистрации
        const translations = {
            ru: {
                registration_title: "Регистрация",
                fullname_label: "Имя*",
                fullname_placeholder: "Имя и фамилия через пробел",
                email_label: "Email*",
                email_placeholder: "Введите вашу почту",
                password_label: "Пароль*",
                password_placeholder: "Не менее 8 символов",
                confirm_password_label: "Подтверждение пароля*",
                confirm_password_placeholder: "Повтор пароля",
                already_account: "Уже есть аккаунт?",
                login_link: "Войти",
                verify_email_title: "Подтвердите Email",
                verify_email_text: "Мы отправили письмо на",
                resend_verification: "Отправить повторно",
                verify_email_hint: "Не получили письмо? Проверьте папку 'Спам' или попробуйте отправить повторно.",
                registration_complete_title: "Регистрация завершена!",
                welcome_text: "Добро пожаловать в киберспорт. Не забудь ознакомиться с нашими",
                rules_link: "правилами",
                wish_text: "пользования ресурса. Желаем тебе успехов!",
                main_page_link: "Главная",
                footer_description: "— это новая профессиональная киберспортивная лига, учрежденная с целью развития и структурирования соревновательной экосистемы в современных дисциплинах киберспорта",
                rights_reserved: "Все права защищены.",
                tournament_rules: "Правила турниров",
                privacy_policy: "Политика конфиденциальности",
                terms_of_use: "Условия использования",
                feedback_title: "Обратная связь",
                feedback_text1: "Обратная связь помогает нам становиться лучше.",
                feedback_text2: "Будем рады любым вопросам и предложениям.",
                feedback_text3: "Обработка запроса в течение",
                feedback_modal_title: "Обратная связь",
                feedback_email_label: "Ваш Email*",
                feedback_email_placeholder: "Почта, на которую вам придет ответ",
                feedback_message_label: "Ваше обращение*",
                feedback_message_placeholder: "Опишите вопрос или предложение...",
                send_button: "Отправить",
                password_recovery_title: "Восстановление пароля",
                recovery_email_label: "Email*",
                recovery_email_placeholder: "Введите ваш email",
                recovery_send_button: "Отправить ссылку"
            },
            en: {
                registration_title: "Registration",
                fullname_label: "Full Name*",
                fullname_placeholder: "First and last name with space",
                email_label: "Email*",
                email_placeholder: "Enter your email",
                password_label: "Password*",
                password_placeholder: "At least 8 characters",
                confirm_password_label: "Confirm Password*",
                confirm_password_placeholder: "Repeat password",
                already_account: "Already have an account?",
                login_link: "Login",
                verify_email_title: "Confirm your Email",
                verify_email_text: "We sent an email to",
                resend_verification: "Resend",
                verify_email_hint: "Didn't receive the email? Check your Spam folder or try to resend.",
                registration_complete_title: "Registration Complete!",
                welcome_text: "Welcome to esports. Don't forget to check out our",
                rules_link: "rules",
                wish_text: "of using the resource. We wish you success!",
                main_page_link: "Home",
                footer_description: "is a new professional esports league established to develop and structure the competitive ecosystem in modern esports disciplines",
                rights_reserved: "All rights reserved.",
                tournament_rules: "Tournament Rules",
                privacy_policy: "Privacy Policy",
                terms_of_use: "Terms of Use",
                feedback_title: "Feedback",
                feedback_text1: "Feedback helps us improve.",
                feedback_text2: "We welcome any questions and suggestions.",
                feedback_text3: "Request processing within",
                feedback_modal_title: "Feedback",
                feedback_email_label: "Your Email*",
                feedback_email_placeholder: "Email where you will receive the answer",
                feedback_message_label: "Your Message*",
                feedback_message_placeholder: "Describe your question or suggestion...",
                send_button: "Send",
                password_recovery_title: "Password Recovery",
                recovery_email_label: "Email*",
                recovery_email_placeholder: "Enter your email",
                recovery_send_button: "Send Link"
            }
        };

        function changeLanguage(lang) {
            // Сохраняем выбор языка
            localStorage.setItem('preferredLanguage', lang);
            
            // Обновляем активный флажок
            document.querySelectorAll('.language-flag').forEach(flag => {
                flag.classList.toggle('active', flag.getAttribute('data-lang') === lang);
            });
            
            // Устанавливаем атрибут lang для всей страницы
            document.documentElement.lang = lang;
            
            // Обновляем текст элементов
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[lang][key]) {
                    element.textContent = translations[lang][key];
                }
            });
            
            // Обновляем плейсхолдеры
            document.querySelectorAll('[data-translate-placeholder]').forEach(input => {
                const key = input.getAttribute('data-translate-placeholder');
                if (translations[lang][key]) {
                    input.placeholder = translations[lang][key];
                }
            });
            
            // Обновляем title страницы
            const titleElement = document.querySelector('h1[data-translate="registration_title"]');
            if (titleElement && translations[lang]['registration_title']) {
                document.title = translations[lang]['registration_title'] + ' | Arena Warborn League';
            }
        }

        // Инициализация языкового переключателя
        document.addEventListener('DOMContentLoaded', function() {
            // Настройка переключения пароля
            setupPasswordToggle();
            
            // Настройка языкового переключателя
            const flags = document.querySelectorAll('.language-flag');
            flags.forEach(flag => {
                flag.addEventListener('click', function() {
                    const lang = this.getAttribute('data-lang');
                    changeLanguage(lang);
                });
            });
            
            // Загружаем сохраненный язык или используем русский по умолчанию
            const savedLanguage = localStorage.getItem('preferredLanguage') || 'ru';
            changeLanguage(savedLanguage);
        });