<?php
/**
 * 这是一个认证控制器
 */

namespace app\admin\controller;

use think\Session;
use app\admin\model\User;
use app\admin\model\Scenic;
use app\admin\model\Area;
use app\admin\model\Hotel;
use think\Controller;
use think\Request;
use think\Db;
use think\Route;

class Auth extends Controller
{
	
	public  function index()
	{
		return $this->fetch();
	}

	public function login()
	{
		return $this->fetch();
	}
	//登陆判断
	public function doLogin(Request $request, User $user)
	{
		
		$user = User::get(['username' => $request->param('username')]);	

		if($user){
			if ($user->password == md5($request->param('password'))) {
				Session::set('username',$request->param('username'));
				return $this->fetch('index');				
			} else {
				$this->error('密码输入错误');
			}
		} else {
			$this->error('用户名不存在');
		} 
		
	}

	public function logout()
	{
		session(null);
	}

	public function register()
	{

	}

	public function doRegister()
	{

	}

	public function checkLogin()
	{
		return session('uid');
	}

	//酒店管理
	public function info(Request $request, Hotel $hotel,Area $area)
	{
		//酒店地点
		$sitess = Db::name('area')->field('site,id')->select();
		$id = $request->param('id');
		$this->assign([
			'sites'=> $sitess,
			]);
		//酒店状态
		$all = Db::name('hotel')->where('aid',$id)->paginate(100);
		$count = count($all);	
		$this->assign([
			'all'=>$all,
			'count'=>$count,
			]);
		return $this->fetch();
	}
	//判断酒店状态
	public function infos(Request $request,Hotel $hotel)
	{
		$id = $request->param('id');
		$txt = $request->param('txt');		
		if($txt == '已上架'){
			$delete_time = 1;
			Db::name('hotel')
				->where('id', $id)
				->update(['delete_time' => $delete_time]);
			return 1;
		}else{
			$delete_time = 0;
			Db::name('hotel')
				->where('id', $id)
				->update(['delete_time' => $delete_time]);
			return 2;
		}
	}
	
	//批量删除酒店
	public function clearinfo(Request $request,Hotel $hotel,Area $area)
	{
		$somes = Request::instance()->post(false);
		
		if(!empty($somes)){
			$some = $somes['id'];
			foreach($some as $value){
			$del = Db::name('hotel')->where('id',$value)->delete();
		}
	}else{
		return $this->error('请选择要删除的酒店');
	}	
		return $this->success('已成功删除');
	}
	//酒店信息展示
	public function hotelInfo(Request $request,Hotel $hotel,Area $area)
	{
		$hotelAll = Db::name('hotel')->where('status',1)->paginate(1);
		$this->assign([
			'hotelall'=>$hotelAll,
			]);
		return $this->fetch();
	}
	//添加酒店
	public function addhotel()
	{
		return $this->fetch();
	}
	public function addhotels(Request $request,Area $area,Hotel $hotel)
	{
		//获取上传信息
		$newsite = $request->param('sites');
		$name = $request->param('title');
		$allowtime = $request->param('allowtime');
		$brief = $request->param('note');
		$about = $request->param('notes');
		$room = $request->param('authour');
		$amount = $request->param('all');
		$balance = $request->param('views');
		//获取上传图片
		
		$imgs = request()->file('img');
		$info = $imgs->move(ROOT_PATH . 'public' . DS . 'uploads');
		if($info){
		// 成功上传后 获取上传信息
		// 输出 jpg
		$info->getExtension();		
		// 输出 20160820/42a79759f284b767dfcb2a0197904287.jpg
		$info->getSaveName();
		// 输出 42a79759f284b767dfcb2a0197904287.jpg		
		$picture = $info->getFilename();
		}else{
		// 上传失败获取错误信息
		echo $file->getError();
		}
		//拼接上传图片路径
		$path = date('Ymd',time());
		$newpicture = "__PATH__"."/".$path."/".$picture;

		//查询地区所对应的酒店
		$result = $area->where('site', $newsite)->find();
		if($result){		
		$aid = Db::name('area')->where('site',$newsite)->select()[0]['id'];
		}else{
		//添加酒店
			$area->site = $newsite;
			$area->save();
		//获取新地区自增ID	
			$aid = $area->id;
		}
	//判断上传信息是否齐全		
	if(($name != null) && ($allowtime != null) && ($brief != null) && ($room != null) && ($amount != null) && ($balance != null) && ($about != null)){
		//添加上传信息
		$hotel->data([
		'name' => $name,
		'allowtime' => $allowtime,
		'brief' => $brief,
		'room' => $room,
		'about' => $about,
		'aid' => $aid,
		'sid' => $aid,
		'amount' => $amount,
		'balance' => $balance,
		'picture' => $newpicture
		]);		
		$hotel->save();	
		return $this->success('添加成功');
		}else{
			return $this->error('请补全信息');
		}		
	}
	//修改酒店信息界面
	public function alterhotel(Request $request,Hotel $hotel)
	{	
		$id = $request->param('id');
		$show = Db::name('hotel')->where('id',$id)->select();
		$this->assign([
			'show' => $show,
			]);
		return $this->fetch();
	}

	//修改酒店信息
	public function alterNhotel(Request $request,Hotel $hotel)
	{
		//获取要修改酒店所在区域id
		$id = $request->param('id');
		//获取修改信息
		$name = $request->param('title');
		$allowtime = $request->param('allowtime');
		$brief = $request->param('note');
		$about = $request->param('notes');
		$room = $request->param('authour');
		$amount = $request->param('all');
		$balance = $request->param('views');
		
		//获取上传图片
		$imgs = request()->file('img');	
		$info = $imgs->move(ROOT_PATH . 'public' . DS . 'uploads');
		if($info){
		// 成功上传后 获取上传信息
		// 输出 jpg
		$info->getExtension();		
		// 输出 20160820/42a79759f284b767dfcb2a0197904287.jpg
		$info->getSaveName();
		// 输出 42a79759f284b767dfcb2a0197904287.jpg		
		$picture = $info->getFilename();
		}else{
		// 上传失败获取错误信息
		echo $file->getError();
		}
		//拼接上传图片路径
		$path = date('Ymd',time());
		$newpicture = "__PATH__"."/".$path."/".$picture;
		

		if(($name != null) && ($allowtime != null) && ($brief != null) && ($room != null) && ($amount != null) && ($balance != null) && ($about != null)){
			Db::name('hotel')
			->where('id', $id)
			->update([
				'name' => $name,
				'allowtime' => $allowtime,
				'brief' => $brief,
				'about' => $about,
				'room' => $room,
				'amount' => $amount,
				'balance' => $balance,
				'picture' => $newpicture,
				]);
			return $this->success('修改成功');
		}else {
			return $this->error('请将信息补全');
		}
	}
	//酒店回收
	public function hotelBook()
	{
		$hotelbook = Db::name('hotel')->where('status',1)->paginate(3);
		$this->assign([
		'hotelbook' => $hotelbook,	
		]);
		return $this->fetch();
	}
	//删除已选中酒店
	public function desHotelOne(Request $request, Hotel $hotel)
	{
		$id = $request->param('id');
		 $judge = Db::name('hotel')->where('id',$id)->delete();
		 if($judge){
		 	return $this->success('已成功删除');
		 }else{
		 	return $this->error('请选择要删除的酒店');
		 }	
	}
	//批量删除已下架的酒店
	public function desHotelAll(Request $request , Hotel $hotel)
	{
		//获取要删除酒店的ID
		$some = Request::instance()->post(false);
		//判断是否获得酒店ID
		if(empty($some['id'])){
			return $this->error('请选中要删除的景区');
		}
		$id = $some['id'];	
		foreach($id as $value){
		//删除被选中ID的酒店
		$none = Db::name('hotel')->where('id',$value)->delete();
			}
		if($none){
			return $this->success('已全部删除');
		} else{
			return $this->error('删除失败');
		}
	}
	//恢复酒店上架
	public function hotelRegain(Request $request,Hotel $hotel)
	{
		$id = $request->param('id');
		//将被选中ID的景点上架
		Db::name('hotel')
		->where('id', $id)
		->update(['delete_time' => '']);
		return $this->success('已恢复上架');
	}
	//批量恢复酒店上架
	public function hotelRall(Request $request)
	{
		$id = $request->param('id');
		$or = Db::name('hotel')
			->where('id',$id)
			->update(['delete_time' => '']);
		if($or){
			return '1';
		}else{
			return '2';
		}
	}

	//修改管理员密码
	public function pass()
	{
		return $this->fetch();
	}
	public function newpassword(Request $request, User $user)
	{		
		//获取管理员账号
		$username = Session::get('username');
		$password = User::get(['password' => md5($request->param('mpass'))]);
		//修改管理员密码
		if($password){
			$newpassword = $request->param('newpass');
			$rnewpassword = $request->param('renewpass');
			if($newpassword == $rnewpassword){
				$user = new User;
				$user->save([
					'password' => md5($newpassword),
					],['username' => $username]);
					return $this->success('修改成功');				
			}
			else{
				return $this->error('两次密码不一致');
			}
		}else{
			return $this->error('密码不存在');
		}		
	}

	public function page()
	{
		return $this->fetch();
	}

	public function adv()
	{
		return $this->fetch();
	}
	//回收站
	public function book(Scenic $scenic)
	{
		$book = Db::name('scenic')->where('status',1)->paginate(10);
		$this->assign([
		'book' => $book,	
		]);
		return $this->fetch();
	}
	//恢复景点上架
	public function regain(Request $request ,Scenic $scenic)
	{
		$id = $request->param('id');
		/*
		$result = $scenic->save(
			[
		'delete_time' => '',
		'update_time' => ''
		],
		['id' => $id]);
		echo Scenic::getLastsql();
		*/
		//将被选中ID的景点上架
		Db::name('scenic')
		->where('id', $id)
		->update(['delete_time' => '']);
		return $this->success('已恢复上架');
	}
	//景点回收
	//删除景点
	public function gone(Request $request ,Scenic $scenic)
	{
		$id = $request->param('id');
		Db::name('scenic')->where('id',$id)->delete();
		return $this->success('干掉了');
	}
	//删除全部景点
	public function destroyAll(Request $request,Scenic $scenic)
	{
		//获取要删除景点的ID
		$some = Request::instance()->post(false);
		//判断是否获得景点ID
		if(empty($some['id'])){
			return $this->error('请选中要删除的景区');
		}
		$id = $some['id'];		
		foreach($id as $value){
		//删除被选中ID的景点
		$none = Db::name('scenic')->where('id',$value)->delete();
			}
		if($none){
			return $this->success('已全部删除');
		} else{
			return $this->error('删除失败');
		}

	}


	public function column()
	{
		return $this->fetch();
	}

	//景区信息
	public function lists()
	{
		return $this->fetch();
	}


	//景点展示
	public function list()
	{
		/*
		$all =  Db::name('scenic')->field('id,spot,ticket,cid,picture,about,amount,balance')->select();	
		$spot = Db::name('scenic')->field('spot')->select();
		$ticket = Db::name('scenic')->field('ticket')->select();
		$cid = Db::name('scenic')->field('cid')->select();
		$picture = Db::name('scenic')->field('picture')->select();
		$about = Db::name('scenic')->field('about')->select();
		$amount = Db::name('scenic')->field('amount')->select();
		$balance = Db::name('scenic')->field('balance')->select();	
		$delete_time = Db::name('scenic')->field('delete_time')->select();
		$this->assign([
		'all' => $all,		
		]);		
		*/
		//已上架景点展示、分页
		$list = Db::name('scenic')->where('status',1)->paginate(3);
		$this->assign([
		'list' => $list,	
		]);
		return $this->fetch();
	}
	public function alter(Request $request ,Scenic $scenic)
	{
		$id = $request->param('id');

		$show = Db::name('scenic')->where('id',$id)->select();
		/*
		foreach ($show as $shows) {
		}
		$show = $shows;
		*/
		$this->assign([
			'show' => $show,
		]);
		return $this->fetch();	
	}
	//修改景点信息
	public function confirm(Request $request)
	{

		$id = $request->param('id');
		//获取上传图片
		$imgs = request()->file('img');
		$info = $imgs->move(ROOT_PATH . 'public' . DS . 'uploads');
		if($info){
		// 成功上传后 获取上传信息
		// 输出 jpg
		$info->getExtension();		
		// 输出 20160820/42a79759f284b767dfcb2a0197904287.jpg
		$info->getSaveName();
		// 输出 42a79759f284b767dfcb2a0197904287.jpg		
		$picture = $info->getFilename();
		}else{
		// 上传失败获取错误信息
		echo $file->getError();
		}
		//拼接上传图片路径
		$path = date('Ymd',time());
		$newpicture = "__PATH__"."/".$path."/".$picture;
		 
		$title = $request->param('title');		
		$note = $request->param('note');
		$authour = $request->param('authour');
		$all = $request->param('all');
		$views= $request->param('views');
		$allowtime = $request->param('allowTime');
		if(($title != null)&&($note != null)&&($authour != null)&&($all != null)&&($views != null)){	
			
			Db::name('scenic')
			->where('id', $id)
			->update(['spot' => $title,'about' => $note,'ticket' => $authour,'amount'=>$all,'balance'=>$views,'picture' => $newpicture,'allowtime' => $allowtime]);
			return $this->success('修改成功');
		}else {
			return $this->error('修改失败');
		}
		
	}
	//单个景点下架
	public function sold(Request $request, Scenic $scenic)
	{
		$id = $request->param('id');
		/*
		$c = Scenic::destroy($id);
		echo Scenic::getLastsql();
		die();
		*/
		$c =Db::name('scenic')
			->where('id', $id)
			->update(['delete_time' => '1']);
		if($c){
		return $this->success('已成功下架');
		} else{
			return $this->error('失败');
		}
		
	}
	//景点批量下架
	public function allhidden(Request $request,Scenic $scenic)
	{

		$some = Request::instance()->post(false);
		//判断是否选中景点
		if(empty($some['id'])){
			
			return $this->error('请选中要下架的景区');
		}
		$id = $some['id'];		
		foreach($id as $value){
		$none = Db::name('scenic')
				->where('id', $value)
				->update(['delete_time' => '1']);
			}
		if($none){
			return $this->success('下架成功');
		} else {
			return $this->error('无可下架商品');
		}
	}

	//添加景点
	public function addition()
	{
		return $this->fetch();
	}
	//添加景点
	public function append(Request $request , Scenic $scenic,Area $area)
	{
		//获取添加内容
		$title = $request->param('title');		
		$note = $request->param('note');
		$authour = $request->param('authour');
		$all = $request->param('all');
		$views= $request->param('views');
		$allowtime = $request->param('allowtime');
		$newsite = $request->param('sites');
		$newsites[] = $newsite;
		//上传景区		
		//判断景区是否存在	
		$result = $area->where('site', $newsite)->find();
		if($result){
		//查询景点所对应的景区
		$cid = Db::name('area')->where('site',$newsite)->select()[0]['id'];
		}else{
		//添加新景区
			$area->site = $newsite;
			$area->save();
		//获取新景区自增ID	
			$cid = $area->id;
		}	
		//获取上传图片	
		$imgs = request()->file('img');
		//判断是否有上传图片
		if(empty($imgs)){
			return $this->error('请添加景区图片');
		} else{
		$info = $imgs->move(ROOT_PATH . 'public' . DS . 'uploads');
		if($info){
		// 成功上传后 获取上传信息
		// 输出 jpg
		$info->getExtension();		
		// 输出 20160820/42a79759f284b767dfcb2a0197904287.jpg
		$info->getSaveName();
		// 输出 42a79759f284b767dfcb2a0197904287.jpg		
		$picture = $info->getFilename();
		}else{
		// 上传失败获取错误信息
		echo $file->getError();
		}
		//拼接上传图片路径
		$path = date('Ymd',time());
		$newpicture = "__PATH__"."/".$path."/".$picture;

		//判断上传信息是否齐全
		if(($title != null) && ($note != null) && ($authour != null) && ($all != null) && ($views != null) && ($newpicture != null)){
		$scenic->data([
		'spot' => $title,
		'ticket' => $authour,
		'allowtime' => $allowtime,
		'cid' => $cid,
		'about' => $note,
		'amount' => $all,
		'balance' => $views,
		'picture' => $newpicture
		]);		
		$scenic->save();	
		return $this->success('添加成功');
		}else{
			return $this->error('请补全信息');
		}
	}
	}

	//景区信息
	public function advertising(Request $request,Area $area, Scenic $scenic)
	{
		//获取景区
		$sites =  Db::name('area')->field('site,id')->select();
		//$id =  Db::name('area')->field('id')->select();
		
		//获取景点	
		$id = $request->param('id');	
		$this->assign([
		'sites' => $sites,
		'id' => $id	
		]);	
		//获取景区所对应的景点
		//$all = Db::name('scenic')->where('cid',$id)->select();
		//分页
		$all = Db::name('scenic')->where('cid',$id)->paginate(300);	
		$page = $all->render();
		//dump($page);
		//统计景区内景点个数
		$count = count($all);
		$this->assign([
			'all' => $all,
			'count' => $count,
			'page' => $page,
			]);	
		return $this->fetch();
	
	}
	//景区所对应的景点
	public function adver(Request $request,Area $area, Scenic $scenic)
	{
		$id = $request->param('id');
		$txt = $request->param('txt');		
		if($txt == '已上架'){
			$delete_time = 1;
			Db::name('scenic')
				->where('id', $id)
				->update(['delete_time' => $delete_time]);
			return 1;
		}else{
			$delete_time = 0;
			Db::name('scenic')
				->where('id', $id)
				->update(['delete_time' => $delete_time]);
			return 2;
		}
		
	}
	 
	public function clearSpot(Request $request, Scenic $scenic, Area $area)
	{
		/*
		$id = $request->param('id');
		dump($id);
		*/
		$some = Request::instance()->post(false);
		
		if(empty($some['id'])){
			return $this->error('请选中要删除的景点');
		}else{
		$id = $some['id'];	
		foreach($id as $value){
		//删除被选中ID的景点
		$none = Db::name('scenic')->where('id',$value)->delete();
			}
		return $this->success('成功删除');
	}
	
	}

	//删除景区
	public function clearArea(Request $request,Area $area,Scenic $scenic)
	{
		$id = $request->param('id');
		$del = Db::name('area')->where('id',$id)->delete();
		$delete_spots = Db::name('scenic')->where('cid',$id)->delete();
		if($del){
			return $this->success('该景区已删除');
		}else{
			return $this->error('景区不存在');
		}
		
	}
	//添加景区界面
	public function addArea()
	{
		return $this->fetch();		
	}
	//添加景区
	public function addAreas(Request $request,Area $area)
	{
		$site = $request->param('site');
		$result = $area->where('site', $site)->find();
		if ($result) {
			return $this->error('景区存在');
		} else {
			if(!empty($site)){
			$area->data([
			'site' => $site,
			]);
			$area->save();
			return $this->success('添加成功');
		}else{
			return $this->error('添加失败');
		}
		}	
	} 

	//用户
	//用户信息
	public function myself(Request $request,User $user)
	{
		$users = Db::name('user')->where('level',0)->paginate(10);
		//
		$this->assign([
		'user' => $users,	
		]);
		return $this->fetch();
	}
	//用户消费记录
	public function mynotes(Request $request,User $user)
	{
		//获取用户id
		$id = $request->param('id');
		$record = Db::name('user')->field('record')->where('id',$id)->select();
		$myrecord = json_decode($record[0]['record'],true);
		//判断用户是否有消费记录
		if($myrecord){
			$this->assign([
			'record' => $myrecord,
			]);
		return $this->fetch();
	}else{
		return $this->error('该用户暂无消费记录');
	}
	}
	//用户购物车信息
	public function mystored(Request $request,User $user)
	{
		//获取用户id
		$id = $request->param('id');
		$drivers = Db::name('user')->field('drivers')->where('id',$id)->select();
		//转换用户数据格式
		$mydrivers = json_decode($drivers[0]['drivers'],true);
		//判断用户购物车是否有数据
		if($mydrivers){
			$this->assign([
			'mydrivers' => $mydrivers,
			'myid' => $id,
			]);
		return $this->fetch();
	}else{
		return $this->error('该用户购物车暂无记录');
	}	
	}
	
		//清空用户购物车
	public function clearMyTor(Request $request,User $user)
	{
		$id = $request->param('id');
		$none = Db::name('user')
				->where('id', $id)
				->update(['drivers' => ' ']);
			
		if($none){
			return 1;
		}else{
			return 2;
		}
		
	}
	
	public function orderAll()
	{
		return $this->fetch();
	}
	public function add()
	{
		return $this->fetch();
	}
	public function cate()
	{
		return $this->fetch();
	}
	public function cateedit()
	{
		return $this->fetch();
	}
}