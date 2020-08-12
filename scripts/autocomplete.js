'use strict';

// var formCompleteMessage = 'Thank you! We\'ll be in touch.';

function ppcconversion() {
    var iframe = document.createElement('iframe');
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    document.body.appendChild(iframe);
    iframe.src = Settings.TEMP_DIR + 'adwords_conversion_code.php';
};

$(function () {
    var theForm = document.getElementById('theForm');
    var contactBoxHeight = $('contact-input-box').height();
    var halfHourTimeout;
    var send = false;

    function trySubmitForm(onComplete) {
        var q1 = $('#q1').val();
        var q2 = $('#q2').val().replace('-', '');
        var q3 = $('#q3').val();
        var q4 = $('#q4').val();
        var q5 = $('#q5').val();

        var names = q1.split(' ');

        if (!send && q1 && q2) {
            send = true;
            var data = {
                'FirstName': names[0],
                'LastName': names[1] ? names[1] : 'no-last-name',
                'MobilePhone': q2.substring(0, 3) + '-' + q2.substring(3),
                'Age': q3,
                'Manufacturer': q4,
                'Model': q5
            };

            console.log(data);

            $.post('http://phoenix-insurance.co.il/young/ins/0916/api/sendLead.php', data).done(function (result) {
                console.log('Server responds: ' + result);

                if (onComplete) onComplete();
            });
        }
    };

    $('#q1').focus(function () {
        if (halfHourTimeout) return;
        halfHourTimeout = setTimeout(trySubmitForm, 30 * 60 * 1000);
    });

    window.onbeforeunload = function () {
        trySubmitForm();
    };

    new stepsForm(theForm, {
        onSubmit: function onSubmit(form) {
            // hide form
            classie.addClass(theForm.querySelector('.simform-inner'), 'hide');

            //  $('.contact-text-box').addClass('animated fadeOut');
            // $('.contact-text-bottom').addClass('animated fadeOut');
            $('.contact-text-box').hide();
            $('.contact-text-bottom').hide();

            trySubmitForm(function () {
                ppcconversion();
            });

            // let's just simulate something...
            var messageEl = theForm.querySelector('.final-message');
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({ 'event': 'form-success' });
            }
            $('.final-message').css('height', contactBoxHeight + 'px');
            // messageEl.innerHTML = formCompleteMessage;
            classie.addClass(messageEl, 'show');
        },
        onStepChange: function onStepChange(step) {
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({ 'event-data': step, 'event': 'form-step' });
            }

            if (step != 5) return;
            $('#q5').autocomplete({
                source: models[$('#q4').val()]
            });
        }
    });

    $('#q4').autocomplete({
        source: manufacturers
    });

    window.pagingSystem.subscribe(function (pageId) {
        var width = $(window).outerWidth();
        if (width < 992) return;
        if (pageId == 'contact') {
            $('#q1').focus();
        } else $('#q1').blur();
    });
});

$(function () {
    var theForm = document.getElementById('theForm2');
    var send = false;

    function trySubmitForm(onComplete) {
        var q1 = $('#q2-1').val();
        var q2 = $('#q2-2').val().replace('-', '');
        var q3 = $('#q2-3').val();
        var q4 = $('#q2-4').val();
        var q5 = $('#q2-5').val();

        var names = q1.split(' ');

        if (!send && q1 && q2) {
            send = true;
            var data = {
                'FirstName': names[0],
                'LastName': names[1] ? names[1] : 'no-last-name',
                'MobilePhone': q2.substring(0, 3) + '-' + q2.substring(3),
                'Age': q3,
                'Manufacturer': q4,
                'Model': q5
            };

            console.log(data);

            $.post('http://phoenix-insurance.co.il/young/ins/0916/api/sendLead.php', data).done(function (result) {
                console.log('Server responds: ' + result);

                if (onComplete) onComplete();
            });
        }
    };

    window.onbeforeunload = function () {
        trySubmitForm();
    };

    new stepsForm(theForm, {
        onSubmit: function onSubmit(form) {
            // hide form
            classie.addClass(theForm.querySelector('.simform-inner'), 'hide');

            //  $('.contact-text-box').addClass('animated fadeOut');
            // $('.contact-text-bottom').addClass('animated fadeOut');
            $('.contact-text-box').hide();
            $('.contact-text-bottom').hide();

            trySubmitForm(function () {
                ppcconversion();
            });

            // let's just simulate something...
            var messageEl = theForm.querySelector('.final-message');
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({ 'event': 'form-success' });
            }
            // messageEl.innerHTML = formCompleteMessage;
            classie.addClass(messageEl, 'show');
        },
        onStepChange: function onStepChange(step) {
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({ 'event-data': step, 'event': 'form-step' });
            }

            if (step != 5) return;
            $('#q2-5').autocomplete({
                source: models[$('#q2-4').val()],
                appendTo: '#form-2-autocomplete'
            });
        }
    });

    $('#q2-4').autocomplete({
        source: manufacturers,
        appendTo: '#form-2-autocomplete'
    });
});

var manufacturers = [];
manufacturers = ['בחר יצרן רכב', 'אודי', 'אופל', 'איווקו', 'איסוזו-מ', 'אלפא רומאו', 'ב.מ.וו.', 'ביואיק', 'ג\'יפ-תע"ר', 'דאצ\'יה', 'דודג\'', 'דייהו', 'דייהטסו', 'האמר', 'הונדה', 'וולוו', 'טויוטה', 'יגואר', 'יונדאי', 'לנד רובר', 'לנצ\'יה', 'מאזדה', 'מיצובישי', 'מרצדס', 'ניסן', 'סאאב', 'סאן-יאנג', 'סובארו', 'סוזוקי', 'סיאט', 'סיטרואן', 'סמרט', 'סקודה', 'פולקסווגן', 'פורד', 'פורד א', 'פורשה', 'פיאט', 'פיג\'ו', 'קאדילק', 'קאיה', 'קרייזלר', 'רובר', 'רנו', 'שברולט'];

var models = {};
models['בחר יצרן רכב'] = [];

models['אודי'] = ['A-1', 'A-3', 'A-3 החדשה', 'A-4', 'A-6', 'A-6 C-7 החדשה', 'A-7', 'A-8', 'A-8 החדשה', 'Q-3', 'Q-5', 'Q-7', 'Q-7', 'Q-7 החדש', 'S-6', 'S-7', 'S-8', 'אולרוד'];
models['אופל'] = ['אומגה', 'אינסיגניה', 'אסטרה', 'אסטרה החדשה', 'ויורו', 'ויורו החדש', 'וקטרה', 'זאפירה', 'טיגרה', 'מוקה', 'מריבה', 'קורסה', 'קורסה החדשה'];
models['איווקו'] = ['35C15'];
models['איסוזו-מ'] = ['D-Max החדש', 'די מקס', 'טנדר', 'טרופר', 'רודיאו'];
models['אלפא רומאו'] = ['147', '156', '159', '166', 'GT', 'בררה', 'ג\'ולייטה', 'מיטו'];
models['ב.מ.וו.'] = ['1.8', '3', '118', '120', '125', '316', '318', '320', '323', '325', '328', '330', '335', '520', '523', '525', '528', '530', '535', '540', '545', '550', '728', '730', '735', '740', '745', '750', '760', '116i', '118i', '235i', '318 החדשה', '320i החדשה', '520i החדשה', '523i החדשה', '528i', '528i החדשה', '535 החדשה', '550i החדשה', 'i120', 'i320', 'i330', 'i340', 'TI', 'X-1', 'X-1 החדש', 'X-3', 'X-3 החדש', 'X-4', 'X-5', 'X-5 החדש', 'X-6', 'X-6 החדש', 'ג\'יפ', 'ג\'יפ (מסחרי)', 'מיני', 'מיני קופר החדשה', 'סדרה 3'];
models['ביואיק'] = ['לה סייבר', 'לה קרוס', 'לה קרוס החדשה', 'לוצרן', 'רנדוו'];
models['ג\'יפ-תע"ר'] = ['סופה'];
models['דאצ\'יה'] = ['DASTER', 'דוקר', 'לודג\'', 'סטפווי', 'סנדרו'];
models['דודג\''] = ['אוונג\'ר', 'ג\'רני', 'ניטרו', 'קאליבר'];
models['דייהו'] = ['לאנוס', 'לגנצה', 'מאטיס', 'נובירה'];
models['דייהטסו'] = ['YRV', 'אפלאוז', 'ג\'יפ', 'גראנד מוב', 'טלקו', 'מאטרייה', 'סומו', 'סיריון', 'ספארי', 'קורה', 'שרייד'];
models['האמר'] = ['H3'];
models['הונדה'] = ['CR-V', 'CR-V החדש', 'CRZ', 'FR-V', 'HRV', 'HRV - החדשה', 'JAZZ', 'JAZZ החדשה', 'אודיסיי', 'אינסייט', 'אקורד', 'לג\'נד', 'סטרים', 'סיוויק', 'סיוויק החדשה'];
models['וולוו'] = ['C-30', 'C-30 החדשה', 'C-70', 'S-40', 'S-40 החדשה', 'S-60', 'S-60 החדשה', 'S-70', 'S-80', 'S-80 החדשה', 'V-40', 'V-40 החדשה', 'V-50', 'V-60', 'V-70', 'XC-60', 'XC-70', 'XC-70 החדש', 'XC-90', 'XC-90'];
models['טויוטה'] = ['300', '400', '430', '460', '400h', '450h', 'CT200H', 'GS-250', 'GS-300H', 'IS-250', 'IS-300H', 'NX-200T', 'NX-300H', 'RX-350', 'אונסיס', 'אוריס', 'אוריס החדשה', 'אייגו', 'היילנדר', 'היילקס', 'הייס', 'הייס', 'ורסו', 'יאריס', 'יאריס החדשה', 'לאנד קרוזר', 'לאנד קרוזר', 'לאנד קרוזר החדש', 'סיינה', 'ספייס', 'פריוויה', 'פריוס', 'פריוס החדשה', 'קאמרי', 'קאמרי החדשה', 'קורולה', 'קורולה החדשה', 'ראב 4', 'ראב 4 החדשה'];
models['יגואר'] = ['S-TYPE', 'XE', 'XF', 'XFR', 'XF-החדשה', 'XJ', 'XJ.6', 'XJ.8', 'XJR', 'X-TYPE', 'דימלר', 'סוברין'];
models['יונדאי'] = ['H-1', 'H100', 'I-10', 'I-10 החדשה', 'I-20', 'I-20 החדשה', 'I-25', 'I-30', 'I-30 החדשה', 'I-35', 'I-40', 'I-800', 'IX-35', 'אטוס', 'אלנטרה', 'אלנטרה החדשה', 'אקסנט', 'גאלופר', 'גטס', 'ולוסטר', 'טוסון', 'טוסון החדשה', 'טראקאן', 'טרג\'ט', 'לנטרה', 'מטריקס', 'סונטה', 'סנטה פה', 'סנטה פה החדשה'];
models['לנד רובר'] = ['דיסקברי', 'דיסקברי', 'דיפנדר', 'פרילנדר', 'פרילנדר החדש', 'ריינג\'', 'ריינג\'', 'ריינג\' רובר החדש'];
models['לנצ\'יה'] = ['אפסילון', 'דלתא', 'קאפה'];
models['מאזדה'] = ['2', '3', '5', '6', '626', '2 החדשה', '3 החדשה', '5 החדשה', '6 החדשה', 'B2500', 'BT-50', 'CX-5', 'MPV', 'דמיו', 'טריביוט', 'לאנטיס', 'פרמסי', 'קסדוס'];
models['מיצובישי'] = ['Hi-Rider', 'L300', 'אוטלנדר', 'אוטלנדר החדש', 'אטראז\'', 'גאלאנט', 'גרנדיס', 'האנטר', 'טריטון', 'כריזמה', 'לנסר', 'לנסר החדשה', 'מגנום', 'סופר לנסר', 'ספייס סטאר', 'ספייסגיר', 'ספייסווגן', 'פג\'רו', 'פג\'רו החדש', 'קולט'];
models['מרצדס'] = ['310', '312', '313', 'A', 'A החדשה', 'B', 'B החדשה', 'C', 'C החדשה', 'CL', 'CLA', 'CLK', 'CLS', 'CLS החדשה', 'E', 'E החדשה', 'E קופה', 'G', 'G-270', 'G-320', 'G-400', 'G-500', 'G-55', 'GL', 'GL החדשה', 'GL-320', 'GL-450', 'GL-500', 'GLA', 'GLC', 'GLE', 'GLK', 'GLS', 'ML', 'ML החדשה', 'ML-270', 'ML-280', 'ML-320', 'ML-350', 'ML-400', 'ML-430', 'ML-500', 'R', 'S', 'S החדשה', 'SLC', 'SLS', 'VIANO', 'ויטו', 'מיקסטו', 'ניו ספרינטר', 'סיטאן', 'ספרינטר'];
models['ניסן'] = ['EX-37', 'FX-30', 'FX-37', 'FX-50', 'G-37', 'M-37', 'Q-50', 'Q-70', 'QX60', 'איקס', 'אלטימה', 'אלמרה', 'אקו-מיקרה', 'ג\'וק', 'ווינר', 'טידה', 'טנדר', 'טראנו', 'ליפ אסנטה', 'לרגו', 'מוראנו', 'מוראנו', 'מיקרה', 'מקסימה', 'נבארה', 'נוט', 'סרנה', 'פאתפינדר', 'פאתפינדר', 'פטרול', 'פטרול', 'פרימרה', 'קשקאי', 'קשקאי החדשה'];
models['סאאב'] = ['9-Mar', '9-May'];
models['סאן-יאנג'] = ['אקטיון', 'אקטיון', 'טיבולי', 'מוסו', 'קורנדו', 'קורנדו', 'קיירון', 'קיירון', 'רודיאוס', 'רודיאוס', 'רקסטון'];
models['סובארו'] = ['B-3', 'B-4', 'B-4 החדשה', 'B-9', 'OUTBACK', 'OUTBACK החדשה', 'XV', 'XV החדשה', 'אימפרזה', 'אימפרזה החדשה', 'לבורג', 'לגאסי/B-4', 'פורסטר', 'פורסטר החדשה'];
models['סוזוקי'] = ['SX4', 'איגניס', 'אלטו', 'בלנו', 'בלנו החדשה', 'ג\'יפ ג\'מיני', 'ג\'יפ ויטרה', 'גרנד ויטרה', 'גרנד ויטרה XL-7', 'גרנד ויטרה החדשה', 'וואגון', 'יורוסוויפט', 'ליאנה', 'מרוטי', 'סוויפט החדשה', 'סלריו', 'ספלאש', 'קארי', 'קרוס אובר'];
models['סיאט'] = ['STYLE Mii', 'איביזה', 'איביזה החדשה', 'אינקה', 'אלהמברה', 'אלתאה', 'טולדו', 'טולדו החדשה', 'לאון', 'לאון החדשה', 'קורדובה'];
models['סיטרואן'] = ['C-1', 'C-15', 'C-2', 'C-3', 'C-3 החדשה', 'C-4', 'C-4 החדשה', 'C-5', 'C-5 החדשה', 'C-6', 'C-8', 'C-8', 'C-CROSSER', 'C-ELYSEE', 'DS3', 'DS4', 'DS5', 'NEMO', 'ברלינגו', 'ג\'מפי', 'סקסו', 'קסנטיה', 'קסרה'];
models['סמרט'] = ['בראבוס', 'סמארט החדשה', 'פולס', 'פורטו', 'פיור', 'פיור סיטי'];
models['סקודה'] = ['אוקטביה', 'אוקטביה החדשה', 'ואן', 'טנדר', 'ייטי', 'ייטי החדשה', 'ניו פליסיה', 'סופרב', 'סופרב החדשה', 'סיטיגו', 'ספייסבק', 'פביה', 'פביה החדשה', 'רומסטר', 'רפיד'];
models['פולקסווגן'] = ['CC החדשה', 'T-5', 'T-5 החדשה', 'T-6', 'אמארוק', 'אפ', 'בורה', 'ג\'טה', 'ג\'טה החדשה', 'ג\'יפ טוארג', 'גולף', 'גולף דור 6', 'גולף דור 6 החדשה', 'גולף דור 7 החדשה', 'גולף ספורטסוואן', 'גולף פלוס', 'גולף קומפורט ליין', 'חיפושית', 'חיפושית החדשה', 'טוארג', 'טוארג החדש', 'טוארג החדש', 'טוראן', 'טוראן החדשה', 'טיגואן', 'טיגואן החדשה', 'מולטי-ואן', 'מולטי-ואן החדש', 'מסחרי', 'משלוח', 'פאסאט', 'פאסאט החדשה', 'פולו', 'פולו החדשה', 'פייטון', 'קאדי', 'קאדי', 'קראפטר', 'קרוול', 'שאטל/קרוול', 'שירוקו'];
models['פורד'] = ['EDGE', 'S-MAX', 'S-MAX החדש', 'גלאקסי', 'טורנאו קונקט', 'טרנזיט', 'מונדאו', 'מונדאו החדשה', 'פוקוס', 'פוקוס החדשה', 'פיאסטה', 'פיאסטה החדשה', 'קוגה'];
models['פורד א'] = ['F-150', 'אסקייפ', 'אקספלורר', 'אקספלורר', 'אקספלורר החדש', 'טאורוס', 'פיוז\'ן', 'ריינג\'ר'];
models['פורשה'] = ['קאיין', 'קאיין ג\'יפ', 'קאיין החדשה', 'מקאן'];
models['פיאט'] = ['500', 'אוליזה', 'בראבה', 'בראבו', 'גרנדה פונטו', 'דובלו', 'דובלו החדשה', 'דוקטו', 'טיפו החדשה', 'כרומה', 'מולטיפלה', 'מריאה', 'סדיצ\'י', 'סקודו', 'פונטו', 'פיורינו', 'פנדה', 'פנדה החדשה', 'קובו'];
models['פיג\'ו'] = ['106', '107', '108', '206', '207', '208', '301', '306', '307', '308', '406', '407', '508', '605', '607', '2008', '3008', '5008', 'אקספרט', 'בוקסר', 'ביפר', 'פרטנר'];
models['קאדילק'] = ['ATS', 'CTS', 'SRX', 'SRX החדש', 'STS', 'סוויל'];
models['קאיה'] = ['JOICE', 'אופטימה', 'אופיריוס', 'אופיריוס החדשה', 'לאו', 'מג\'נטיס', 'מג\'נטיס החדשה', 'מנטור', 'סול', 'סול החדשה', 'סופרטראק', 'סורנטו', 'סורנטו', 'סורנטו החדש', 'סיד', 'סיד החדשה', 'ספורטג\'', 'ספורטג\' החדש', 'סראטו', 'פורטה', 'פורטה החדשה', 'פיקנטו', 'פרג\'יו', 'פרוסיד', 'פרייד', 'קארנס', 'קארנס החדשה', 'קלארוס', 'קרניבל', 'קרניבל', 'ריו', 'ריו החדשה', 'שומה'];
models['קרייזלר'] = ['300C', '300M', 'C-300 החדשה', 'ג\'יפ (מסחריות)', 'ג\'יפ פטריוט', 'ג\'יפ קומפאס', 'ג\'יפ רנגלר', 'גרנד וויג\'ר החדש', 'גרנד צ\'ירוקי', 'גרנד צ\'ירוקי החדש', 'וויג\'ר', 'וויג\'ר', 'נאון', 'סטרטוס', 'סיברינג', 'צ\'ירוקי', 'צ\'ירוקי ספיישל', 'קומפאס החדש', 'קרוזר', 'ריינג\'ד', 'רנגלר'];
models['רובר'] = ['214', '216', '416', '420', 'MG', 'R25', 'R45', 'R75'];
models['רנו'] = ['גרנד סניק החדשה', 'טווינגו', 'טרפיק', 'לגונה', 'לוגן', 'לטיטיוד', 'מאסטר', 'מגאן', 'מגאן החדשה', 'סימבול', 'סניק', 'סניק החדשה', 'פלואנס', 'קאדג\'ר', 'קוליאוס', 'קליאו', 'קליאו החדשה', 'קנגו', 'קנגו', 'קפצ\'ור'];
models['שברולט'] = ['אוואו', 'אופטרה', 'אורלנדו', 'אימפלה', 'אימפלה החדשה', 'אלרו', 'אסטרו', 'אפיקה', 'אפלנדר', 'אפלנדר', 'אקווינוקס', 'וולט', 'ויואנט', 'טראורס', 'טראקס', 'טרייל בלייזר', 'טרייל בלייזר', 'מאליבו', 'מאליבו החדשה', 'סוניק', 'ספארק', 'קווליר', 'קפטיבה', 'קפטיבה', 'קרוז'];
//# sourceMappingURL=autocomplete.js.map
