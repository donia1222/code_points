import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';


const privacyPolicyText = `

Chat GPT Open AI

The App integrates OpenAI API (https://beta.openai.com/docs/api-reference),

API terms & policies are available at https://openai.com/api/policies/service-terms/.

When you share your User Content* you agree to comply with the terms of OpenAI Sharing & Publication Policy.
User Content is any content generated by AI via the App, as well as your input content.

-The images are generated using DALL-E 3 technology. These images are stored in a database and are not linked to the user or their device. The first image that is generated is searched for in the database, but subsequent ones with the same prompt are always generated from scratch. The goal is to reduce the waiting time for image generation and, in the future, to remove the restriction of 10 images per day.


-The responses are generated with Chat GPT 3-5 Turbo / GPT4 ,  Each answer is individually generated for each user, and they are not stored by us.


-The images are analyzed with OpenAI's vision technology. Your images are sent for analysis as anonymous and are received as anonymous. At no point are the images linked to your identity.


Imagenes & Icons (Flatico Premium Suscripción): 
https://www.freepikcompany.com/



Terms and Conditions:
 
Article 1 - General scope and object of the agreement

The following terms and conditions (T&C) govern the relationship between you as a client and our company while interacting through our website https://dog-mentor.com and/or on our application Dog-Mentor.

Navigating and/or interacting on our website and/or application means that you expressly agree to these T&C without reserve or objection.

Our company has the right to modify or to adapt these T&C at any time and without prior notice. These T&C are directly applicable as soon as they are published on our website and/or application and/or sent to you by any means.

Please read these Terms and Conditions carefully before using, interacting or accessing our website and/or application.

By agreeing to these T&C you grant us that you have reached at least the legal majority in your country, state or province of residence. If you are a minor you grant us that you have all the rights and consent from your legal representatives to use our services. If you have not reached the legal majority then you must not use our Services.

You are not entitled to use our services, website and/or application for any illegal or unauthorized purposes.

You must not try to hack, alter the use or functions of our services, send viruses or lead or try to lead any other kind of attack towards our services. You must not try to attempt at our services' integrity either.





Article 2 - Content and Intellectual property

The content provided in our Services might be accessible for free or not. Some content might be required to be logged in or to have a valid paid subscription (IAP, restricted contents or sections).

If some content requires you to have an account or to be registered, please refer to the Article 4 « Registration Process » to know of to access our Services.

The contents of our Services are intended for personal, non-commercial use. All materials available on our Services are protected by copyrights and/or intellectual property rights.

In addition to that some content might be protected by some other rights such as, trademark, patents, trade secrets, database right, sui generis rights and other intellectual or proprietary rights.

The user of our Services is not allowed to reproduce totally or partially any content that is made available through our Services. The user will also not reproduce any of our logo, name, visual identity and so on, he will also not try to reproduce, copy or produce mere copy of our Services.

The user will not modify, copy, paste, translate, sell, exploit or transmit for free or not any of the content, text, photo, pictures, drawing, audio content, podcast or any content that is available on our Services.





Article 3 - Subscription and payment (duration, recurring payment, auto renewal) (KEEP ONLY IF YOU SET IN-APP PURCHASE EXTENSION)

Price

The applicable subscription fees are shown before concluding the ordering process.

Please check how the Apple Store and the Google Store handle tax management and prices.

Any changes in taxes will be directly applicable to the abonnements (IF APPLICABLE TO YOUR SITUATION).

Regarding fee changes or modification, our company reserves the right to change any fee or tariff at any time and without prior notice.

Payment and Fees

Available payment methods will be shown to the client upon subscription, electronic payment will be shown only if available.

Payment methods can vary.

All of your banking details, credit card details and other payment methods are encrypted and are never stored on our website and/or application. We use third-party solutions to process your payment.

We reserve the right to modify at any time any fees, if you do not agree with the price change you can stop using our Services at any time before renewal payment occurs.

In App Purchases (IAP) to access restricted content (articles, videos, blog, unlocking exclusive content or features)

If you have subscribed through a third party such as Google Play, Apple App Store or any other third party, these Terms and Conditions might not apply to you. In that case you contract for such products will be with the third party and not with our Company. 

Our Company will not be liable for any claims related to purchases made through a third party, you must contact that third party directly.

Our Company will have no liability or responsibility regarding any issues or difficulties regarding IAP purchases as they are done through third-party platforms.

Restoring you subscription, digital contents or In App Purchases

If you have made In App Purchases (IAP) through a third party you might be able to restore your previous purchases that you have already made. This can be done using the link within our Application and/or website.





Article 4 - Registration process (KEEP ONLY IF YOU SET IN-APP PURCHASE OR AUTHENTICATION EXTENSION)

Our company might or might not require our client to first register to enable the client to access some part or the whole application and/or website. (CHANGE TO YOUR SITUATION)

Each registration is intended for one user only and you are prohibited from sharing your credentials or your account with anyone.

We may cancel or suspend your access to our Services if you share your credentials.

Please notify us immediately at (INSERT EMAIL ADDRESS) if you think that your credentials are compromised.

Registration

If registration is required to access our website and/or application then the client must first enroll itself by creating an account. To do so the client must fill in the registry form available on our website and/or application. The client will choose a login and a password linked to a valid email address.

By doing so the client agrees that he will keep his credential confidential, secure at all times and that he will not communicate them to any third-party.

Unlogged access can also be made on our website and application (CHECK IF AVAILABLE)

The client must keep its credential confidential at all times and must not share its credentials with anyone.

Our company will not be held liable or responsible for any unauthorized use, modification or access on the client’s account even if fraudulent access is made using the client’s account or banking details.

Signing In with third parties authentication, including but not limited to, « Sign-in with Apple », Facebook and Twitter authentication

These third-party services might be implemented within our application and/or website to help you sign-in alongside creating an account directly on our Services.

You can either choose to register an account directly via the embedded registry form within our application and/or website or you can use third-party authentication mechanisms.

These third-party providers are not linked with our company and hence you must check and read their privacy policies and other legally binding documents that rule their services.

By using third-party authentication mechanisms, you are allowing third-party applications and/or platforms to access some of your personal data, the relationship between you and the platform is outside any kind of control of our company.

By using third-party authentication mechanisms, these platforms or applications might, depending on how you configured your account on their website, post, access, send messages, access, transfer personal data or personal and use personal data according to their own privacy rules and terms and conditions. These are only examples of what a third-party platform can do when you have granted them access to your data.

If you are unsure about how your data is managed while using these authentication services you must not use them and you should use our embedded account registration.

https://www.google.com/intl/fr/about/company/user-consent-policy-help/

https://support.google.com/accounts/answer/10130420#siwg&zippy=%2Chow-it-works%2Chow-data-is-shared





Article 5 - Warranties

The content provided by our Services is provided to the user « as it is » and « as available », we cannot guarantee that the content provided will be exact, true, or error-free. The user accesses our content at its own risks.

We will not be held responsible if any content on our Services is inaccurate or mistaken.





Article 6 - Content moderation (chat, comments and others) and user generated content

If our user uploads, posts or submits any type of content on the Services you represent to us that you have all the necessary legal rights to upload, post or submit such content.

You shall not publish, distribute or upload any content that is, abusive, fake news, obscene, pornographic, illegal.

In addition to that you shall not try to impersonate anyone else or use a fake identity in order to use, access or publish any content on our Services.

You shall not use our Services to transmit any kind of malware, viruses, crypto lockers, ransomware or spyware.

Users will not threaten or verbally abuse other users nor will they spam the Services. User will use respectfully language, you will not try to abuse or discriminate based on race, religion, nationality, sexual gender or preference, age, disability and so on. Hate speech is prohibited.

Our Company has the right to delete, modify, censor and delete a client’s content or account if any of the rules above are violated. This will be done without any prior justification or notice. The client will not receive any compensation.





Article 7 - Liability

Our company will not be liable in case of network disruption, viruses, outside access, fraudulent use of payment methods or any other kind or type of technical issue or fraudulent access.





Article 8 - Third-Party links and external links

Some of the contents available on our website and/or application can include materials from third-parties and outside sources. Third-party links on our websites and/or applications can direct you to outside of our control websites that are not affiliated with us. We are not responsible nor liable for controlling or examining the content or accuracy of third-party websites or outside sources.

Hence we are not liable nor responsible for any damages or misuse while accessing third-party links or external links or sources on our website and/or application.

Please read carefully our privacy policy regarding how to deal with third-party privacy policy, terms and conditions and cookie policy.





Article 9 - Disclaimer of warranties

While using our website and/or application you grant us that we will not be held liable or responsible if data on our services is not accurate, true, complete or correct. The information and data given on our services is given as illustrational and informational only and must not be used for making decisions. Further advice and information must be sought before making any serious decision. You are using our services at your own risk.

Our company reserves the right to modify and/or delete any content on our services without prior notice, but our company has no obligation to update any content available on our services.

Also our company does not guarantee that the use of our services will be error-free, timely, secure or uninterrupted. The client agrees that we can remove services from time to time or add new ones without prior notice.

Our services are delivered and provided to clients « as is » and « as available » for use, without any warranties or conditions of any kind.

In no case our company’s staff, employees, personnel, agents, interns and so on, are not liable for any loss, claim, injury, any indirect or direct damage, incidental, punitive or special damages of any kind or type. This includes loss of profits, lots of revenues, lots of data or savings, whether based on tort law, contract, liability or otherwise.





Article 10 - Indemnification

You as a client of our company agree to indemnify, defend and hold us harmless from any claim or demand, this includes attorney’s fee made by any third-party due to your breach of these T&C or any other document that is binding between you and our company.





Article 11 - Severability

If any part, article or document of these T&C or of any other binding document between you and our company is determined by a competent jurisdiction to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law.

The unenforceable portion shall be deemed to be severed from these T&C such determination will not affect the validity and enforceability of any other remaining provisions.





Article 12 - Termination

All of the obligations and liabilities of the parties that occurred before the termination date shall survive the termination of this agreement.

These T&C are effective unless terminated either by our company or by the client.

The client can notify our company that he no longer wants to use our services or he can simply stop using and/or access our services, websites and/or application.

Our company can terminate this agreement at its sole discretion at any time and without prior notice, the client will hence remain liable for any remaining amounts due to our company.





Article 13 - Governing Law and Venue

The present T&C are ruled by (CHANGE TO APPLICABLE LAW).

Any issue arising from these T&C regarding, but not limited to, their validity, interpretation, execution, consequences and so on will be pleaded in front of the relevant jurisdiction.

The relevant jurisdiction is (INSERT RELEVANT JURISDICTION).





Article 14 - Contact information

If you have any question regarding these Terms and Conditions you can contact us directly at: (INSERT RELEVANT EMAIL ADDRESS).






Cancellation and refunds

(KEEP ONLY IF YOU SET IN-APP PURCHASE EXTENSION)

If our User cancels his subscription, the cancellation will only occur for future charges associated with that subscription. You can notify us of your cancellation at any time and this cancellation will occur at the end of your current billing period.

You will not receive a refund for the current billing cycle, users will continue to have the same access and benefits of your products for the remainder of the current billing period.

You might be able to get a partial or a full refund depending on where you live and based on the applicable legislation and regulation.

Our Company reserves the right to issue refunds or credits at our sole discretion.


If IAP are made within our Services you must check the Store Terms and Conditions on how to manage and get your refund or cancellation. You can check their condition at https://support.apple.com/en-ph/HT204084 for Apple or at https://support.google.com/googleplay/answer/2479637?hl=en for Google.
`;

const GDPRModal = ({ visible, onClose }) => {
    return (
<Modal
    animationType="slide"
    transparent={false}
    visible={visible}
    onRequestClose={onClose}
>
    <GestureHandlerRootView style={styles.container}>
        <PanGestureHandler
            onGestureEvent={(event) => {
                if (event.nativeEvent.translationY > 50 && event.nativeEvent.velocityY > 0) {
                    onClose();
                }
            }}
            onHandlerStateChange={(event) => {
                if (event.nativeEvent.state === State.END) {
                    // Puedes añadir lógica adicional aquí si es necesario
                }
            }}
        >
            <View style={styles.container}>
                <TouchableOpacity 
                    style={{ 
                        alignSelf: 'center',
                        marginTop: 10, 
                        height: 30,
                        justifyContent: 'center',
                        zIndex: 2 
                    }} 
                    activeOpacity={1}
                >
                    <View 
                        style={{
                            height: 3, 
                            width: 40, 
                            backgroundColor: 'white', 
                            borderRadius: 5,
                            marginTop:10
                        }}
                    />
                </TouchableOpacity>

                <ScrollView contentContainerStyle={styles.modalContent}>
                    <Text style={styles.title}>Terms and Conditions (T&C)</Text>
                    <Text style={styles.privacyPolicyText}>
                        {privacyPolicyText}
                    </Text>
                </ScrollView>
            </View>
        </PanGestureHandler>
    </GestureHandlerRootView>
</Modal>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingTop:30
    },
    modalContent: {
        padding: 20,
        paddingTop: 60,  // Agregado espacio adicional en la parte superior para evitar que el texto se superponga con el icono
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: -20,
        color: '#06c2b0',
        textAlign: 'center',
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
        marginTop: 40,
        marginLeft: 10,
    },
    privacyPolicyText: {
        color: 'white',  // Texto blanco
        fontSize: 16,    // Tamaño del texto 16px

    },
});

export default GDPRModal;