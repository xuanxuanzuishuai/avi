<?php
/**
 * 这是一个认证控制器
 */

namespace app\index\controller;

use think\Controller;
use think\Request;
use app\index\model\User;
use think\View;
use think\Session;
class Auth extends Controller
{

	public function __construct(Request $request)
	{
		parent::__construct();
		// dump($request->controller());
		if(!$this->checkLogin() && $request->controller() != 'Auth')
		{
			$this->error('请登录');
		}
	}


	public function login()
	{
	return $this->fetch();
	}

	public function doLogin(Request $request, User $user)
	{
		$user = User::get(['tel' => $request->param('tel')]);
		if($user){
			if ($user->password == md5($request->param('password'))) {
				Session::set('username', $user->username);
				Session::set('icon', $user->icon);
				Session::set('signature', $user->signature);
				//dump($user->username);
				$this->redirect('index/index', null);
				
			} else {
				$this->error('密码输入错误');
			}
		} else {
			$this->error('用户不存在');
		} 
	}

	public function logout()
	{
		session(null);
		$this->success('退出成功');
	}

	public function register()
	{
		return $this->fetch();
	}

	public function doRegister(Request $request, User $user)
	{
		//dump($request->param('username'));
		$time = time();
		$result1 = User::getByUsername($request->param('username'));
		$result2 = User::getByTel($request->param('tel'));
		$username = $request->param('username');
		$password = $request->param('password');
		$tel = $request->param('tel');
		if (strlen($username) < 5) {
			return $this->error('用户名小于5位');
		}
		if (strlen($password) < 6) {
			return $this->error('密码少于6位');
		}
		if (strlen($tel) < 11) {
			return $this->error('手机号不合法');
		}
		if($result1 || $result2) {
			$this->error('用户名或手机号重复');
		} else {
			$user->data([
				'tel' => $request->param('tel'),
				'username' => $request->param('username'),
				'password' => md5($request->param('password')),
				'create_time' => $request->param('create_time')
				]);
			$result = $user->save();
			if($result) {
				$this->success('注册成功');
			} else {
				$this->error('注册失败');
			}
		}	
	}

	public function doUsername(Request $request, User $user)
	{
		//dump($request->param('username'));
		//dump($request->param('username'));
		$time = time();
		$result = User::getByUsername($request->param('username'));
		if($result) {
			return '用户名重复';
		} 
	}

	public function doTel(Request $request, User $user)
	{
		//dump($request->param('tel'));
		$time = time();
		$result = User::getByTel($request->param('tel'));
		if($result) {
			return '该手机号已被注册';
		} 
	}

	public function doTelLogin(Request $request, User $user)
	{
			$result = User::getByTel($request->param('tel'));
			if (!$result) {
				return '该用户不存在';
			}
	}
	public function verify(Request $request, User $user) 
	{
		$username = $request->param('username');
		$result = User::get(['username', $username]);
		if (!$result) {
			return '用户名不存在';
		}
	}
	public function checkLogin()
	{
		if (Request::instance()->session())
		{
			return true;
		} else {
			return false;
		}
	}

	public function confirmCode(Request $request)
	{
		if(!captcha_check($request->param('codeNum'))){
			
			return 1;
			}
	}

	public function checkpassword(Request $request, User $user)
	{
		$password = User::where('username', Session::get('username'))->value('password');
		if ($password == md5($request->param('password'))){
			return '密码正确';
		} else {
			return '密码不正确';
		}	
	}
}
