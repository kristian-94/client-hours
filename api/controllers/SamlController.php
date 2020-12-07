<?php

namespace app\controllers;

use app\models\User;
use Yii;
use yii\filters\AccessControl;
use yii\filters\auth\HttpBasicAuth;
use yii\filters\Cors;
use yii\helpers\ArrayHelper;
use yii\web\Controller;
use yii\helpers\Url;


class SamlController extends Controller {

    // Remove CSRF protection
    public $enableCsrfValidation = false;

    public function behaviors()
    {
        return ArrayHelper::merge([
            [
                'class' => Cors::className(),
                'cors' => [
                    'Origin' => ['*'],
                    'Access-Control-Request-Method' => ['GET', 'POST', 'HEAD', 'OPTIONS'],
                    'Access-Control-Request-Headers' => ['*'],
                    'Access-Control-Allow-Origin' => ['*'],
                ],
            ],
        ], parent::behaviors());
    }

    public function actions() {
        return [
            'login' => [
                'class' => 'asasmoyo\yii2saml\actions\LoginAction',
                'returnTo' => 'http://localhost:8080/index.php/saml/acs'
            ],
            'acs' => [
                'class' => 'asasmoyo\yii2saml\actions\AcsAction',
                'successCallback' => [$this, 'callback'],
                'successUrl' => 'http://localhost/',
            ],
            'sls' => [
                'class' => 'asasmoyo\yii2saml\actions\SlsAction',
                'successUrl' => Url::to('site/bye'),
                'logoutIdP' => true,
            ]
        ];
    }

    /**
     * You can register a callback to do some operation like read the attributes sent by Identity Provider and create a new user from those attributes.
     *
     * @param array $param has 'attributes', 'nameId' , 'sessionIndex', 'nameIdNameQualifier' and 'nameIdSPNameQualifier' from response
     */
    public function callback($param) {
        // Use param attribute to find what user we have now.
        $email = $param['attributes']['mail'][0];
        $givenname = $param['attributes']['givenName'][0];

        // Check if this user exists already.
        $existinguser = User::findOne(['email' => $email]);
        $token = $_COOKIE['PHPSESSIDIDP'];
        if ($existinguser) {
            // Log this user in.
            // todo how do we log in?
            // Set the users token to the PHPSESSIDIDP cookie value.
            $existinguser->setAttribute('access_token', $token);
            $existinguser->save();
            $cookiedetails = [];
            $cookiedetails['username'] = $existinguser->getAttribute('username');
            $cookiedetails['email'] = $existinguser->getAttribute('email');
            $cookiedetails['role'] = $existinguser->getAttribute('role');
            $cookiedetails['access_token'] = $existinguser->getAttribute('access_token');
            // Set cookie to be used by front end. Set everything that makes up the authUser state.
            setcookie('logbook_authUser', json_encode($cookiedetails), 0, '/', 'localhost');

        } else {
            // Create user that we know exists in the idp.
            $user = User::instance();
            $user->setAttributes([
                'email' => $email,
                'username' => $givenname,
                'role' => 1,
                'access_token' => $token,
                'password_hash' => Yii::$app->security->generatePasswordHash('admin'),
            ]);
            $user->save();
            $auth = Yii::$app->authManager;
            // Assign basic role to this new user.
            $auth->assign($auth->getRole('basic'), $user->getAttribute('id'));
        }
        return $email;
    }
}
