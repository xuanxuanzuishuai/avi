<?php

namespace app\index\controller;
use think\Request;
use app\index\model\Scenic;
use app\index\model\User;
use think\Session;
use app\index\model\Hotel;
class Driver 
{
	public function driver(Request $request, User $user, Scenic $scenic, Hotel $hotel)
	{

		if (Session::has('username')) {	
			$user = $user->where('username', Request::instance()->session('username'))->find();
			$username = $user->username;
			$drivers = $user->drivers;
			$cate = $request->param('cate');
			$id = $request->param('id');
			$spot = $request->param('spot');
			$picture = $request->param('picture');
			$about = $request->param('about');
			$amount = $request->param('amount');
			$balance = $request->param('balance');
			$time = time();
			$timee = time();
			$time = date('Y-m-d H:i:s',$time);
			$arr = [$cate, $id, $spot, $picture, $about, $time, $amount, $balance, $timee];
			if ($drivers == null) {
				$array = [];
				$array[0] = $arr; 
				$drivers = json_encode($array);
				$result = $user->save(['drivers' => $drivers], ['username'=> $username]);
				if ($result) {
					return 1;
				} else {
					return 0;
				}
			} else {
				$array = json_decode($drivers, true);
				$count = count($array);
				$array[$count] = $arr;
				$drivers = json_encode($array);
				$result = $user->save(['drivers' => $drivers], ['username' => $username]);
				if ($result) {
					return $count + 1;
				} else {
					return 0;
				}
			}
			
		} else {
			return 88;
		}
	}
}