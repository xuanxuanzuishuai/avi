<?php
namespace app\index\controller;

use app\index\controller\Auth;
use think\Request;
use app\index\model\Scenic;
use app\index\model\User;
use think\Session;
use app\index\model\Hotel;
class Pay extends Auth
{
	
	public function pay(Request $request, Scenic $scenic, Hotel $hotel)
	{
			
		if (!empty(Request::instance()->post()['info'])){
			$info = Request::instance()->post();
			$info = $info['info'];

			foreach($info as $value){
				$arr = explode('.', $value);
				if ($arr[0] == '景点门票'){
					$spot1 = Scenic::get(['spot' => $arr[1]]);
					$name = $spot1->spot;
					$cate = $spot1->cate;
					$ticket = $spot1->ticket;
					$balance = $spot1->balance;
					$id = $spot1->id;
					$picture = $spot1->picture;
					$address = $spot1->address;
					$amount = $spot1->amount;
					$spot = $spot1->spot;
					$rid = $spot1->rid;
					$arr = [$name,$cate,$ticket,$balance,$id,$picture,$address,$amount,$spot,$rid];
					$array[] = $arr;
				} else {
					$hotel = Hotel::get(['name' => $arr[1]]);
					$name = $hotel->name;
					$cate = $hotel->cate;
					$ticket = $hotel->room;
					$balance = $hotel->balance;
					$picture = $hotel->picture;
					$id = $hotel->id;
					$address = $hotel->address;
					$spot = $hotel->name;
					$rid = $hotel->rid;
					$amount = $hotel->amount;
					$arr = [$name,$cate,$ticket,$balance,$id,$picture,$address,$amount,$spot,$rid];
					$array[] = $arr;
				}
			}	
				$this->assign('array', $array);
				return $this->fetch();

		} else {

			if ($request->param('cate') == '景点门票') {
				$spot = Scenic::get(['spot' => $request->param('name')]);
				$name = $spot->spot;
				$cate = $spot->cate;
				$ticket = $spot->ticket;
				$balance = $spot->balance;
				$id = $spot->id;
				$picture = $spot->picture;
				$address = $spot->address;
				$amount = $spot->amount;
				$spot = $spot->spot;
				$this->assign('ticket', $ticket);
				$this->assign('name',$name);
				$this->assign('cate', $cate);
				$this->assign('balance', $balance);
				$this->assign('spot', $spot);
				$this->assign('id', $id);
				$this->assign('picture', $picture);
				$this->assign('address', $address);
				$this->assign('amount', $amount);
				return $this->fetch();
			} else {
				$hotel = Hotel::get(['name' => $request->param('name')]);
				$name = $hotel->name;
				$cate = $hotel->cate;
				$ticket = $hotel->room;
				$balance = $hotel->balance;
				$picture = $hotel->picture;
				$id = $hotel->id;
				$address = $hotel->address;
				$spot = $hotel->name;
				$amount = $hotel->amount;
				$this->assign('ticket', $ticket);
				$this->assign('name',$name);
				$this->assign('cate', $cate);
				$this->assign('balance', $balance);
				$this->assign('spot', $spot);
				$this->assign('id', $id);
				$this->assign('picture', $picture);
				$this->assign('address', $address);
				$this->assign('amount', $amount);
				return $this->fetch();
			}
		}
	
	}
	
	public function doPay(Request $request, User $user, Scenic $scenic)
	{
		$username = Session::get('username');		
		$id = $request->param('id');
		$scenic = Scenic::get($id);
		$spot = $scenic->spot;
		$ticket = $scenic->ticket;
		$balance = $scenic->balance;
		$hot = $scenic->hot;
		$picture = $scenic->picture;
		$cate = $scenic->cate;
		$about = $scenic->about;
		$id = $scenic->id;
		$num = $request->param('num');
		$date = $request->param('date');
		$user = User::get(['username' => $username]);	
		$record = $user->record;
		$balance = $balance - $num;
		$hot = $hot + $num;

		$arr = [];
		$arr['spot'] = $spot;
		$arr['ticket'] = $ticket;
		$arr['num'] = $num;
		$arr['money'] = $num * $ticket;
		$arr['date'] = $date;
		$arr['picture'] = $picture;
		$arr['cate'] = $cate;
		$arr['about'] = $about;
		$arr['id'] = $id;
		$strr = json_encode($arr);
		if (empty($record)){
			$array[0] = $arr;
			$str = json_encode($array);
			$user->save(['record' => $str],['username' => $username]);
			$scenic->save(
				['balance' => $balance, 'hot' => $hot],
				['id' => $id]
				);
			return $strr;
		} else {
			$array = json_decode($record,true);
			$array[0] = $array;
			$array[] = $arr;
			$str = json_encode($array);
			$user->save(['record' => $str], ['username' => $username]); 
			$scenic->save(
				['balance' => $balance, 'hot' => $hot],
				['id' => $id]
				);	
			return $strr;
		}
		return 3;
	}

	

	public function zhifu()
	{
		$this->success('支付成功，祝您旅途愉快');
	}

	public function doPayPay(Request $request, User $user, Scenic $scenic)
	{
			$username = Session::get('username');	
			$a = Request::instance()->post();
			$cates = $a['cate'];
			$ids = $a['id'];
			$nums = $a['num'];
			$dates = $a['date'];
			$con = count($ids);
		for($i=0; $i<$con; $i++) {
			if ($cates[$i] == '景点门票'){
				$id = $ids[$i];
			$scenic = Scenic::get($id);
			$spot = $scenic->spot;
			$ticket = $scenic->ticket;
			$balance = $scenic->balance;
			$hot = $scenic->hot;
			$picture = $scenic->picture;
			$cate = $scenic->cate;
			$about = $scenic->about;
			$id = $scenic->id;

			$num = $nums[$i];
			$date = $dates[$i];
			$user = User::get(['username' => $username]);	
			$record = $user->record;
			$balance = $balance - $num;
			$hot = $hot + $num;

			$arr = [];
			$arr['spot'] = $spot;
			$arr['ticket'] = $ticket;
			$arr['num'] = $num;
			$arr['money'] = $num * $ticket;
			$moneys[] = $num * $ticket;
			$arr['date'] = $date;
			$arr['picture'] = $picture;
			$arr['cate'] = $cate;
			$arr['about'] = $about;
			$arr['id'] = $id;
			$arrs[] = $arr;
			} else {
					$id = $ids[$i];
					$scenic = Hotel::get($id);
					$name = $scenic->name;
					$ticket = $scenic->room;
					$balance = $scenic->balance;
					$hot = $scenic->hot;
					$picture = $scenic->picture;
					$cate = $scenic->cate;
					$about = $scenic->about;
					$id = $scenic->id;

					$num = $nums[$i];
					$date = $dates[$i];
					$user = User::get(['username' => $username]);	
					$record = $user->record;
					$balance = $balance - $num;
					$hot = $hot + $num;
					$arr = [];
					$arr['name'] = $name;
					$arr['ticket'] = $ticket;
					$arr['num'] = $num;
					$arr['money'] = $num * $ticket;
					$arr['picture'] = $picture;
					$arr['cate'] = $cate;
					$arr['about'] = $about;
					$arr['id'] = $id;

					$moneys[] = $num * $ticket;
					$arr['date'] = $date;
					$arrs[]  = $arr;
					$strr[] = json_encode($arr);
					
				}


		}
			if (empty($record)){
			$array[0] = $arrs;
			$str = json_encode($array);
			$user->save(['record' => $str],['username' => $username]);
			$scenic->save(
				['balance' => $balance, 'hot' => $hot],
				['id' => $id]
				);
			} else {
				$array = json_decode($record,true);
				$array[] = $arrs;
				$str = json_encode($array);
				$user->save(['record' => $str], ['username' => $username]); 
				$scenic->save(
					['balance' => $balance, 'hot' => $hot],
					['id' => $id]
					);	
				}
			$moneys = array_sum($moneys);
			if ($arrs) {
				$this->assign('arrs', $arrs);
				$this->assign('moneys', $moneys);
				return $this->fetch();
			} else {
				$this->error('系统异常');
			}
			
	} 
			
			
	
}